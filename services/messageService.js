const mongoose = require('mongoose'),
    logger = require('../config/logger'),
    Message = require('../models/message'),
    firebaseService = require('./firebaseService'),
    linkToPush = 'https://toplance-front.firebaseapp.com';
    topLance = require('../config/config').topLance;

class messageService {

    send(req, res) {
        let userId = req.userID;

        let messageBody = req.body;
        messageBody.from = new mongoose.Types.ObjectId(userId);

        if(messageBody.from.equals(messageBody.to))
            res.status(409).json({success: 'You cannot send message to yourself'});
        else if(topLance.equals(messageBody.to)) {
            res.status(409).json({success: 'You cannot send message to the bot'});
        }
        else
        Message.create(messageBody, (err, data) => {
            if(err) {
                logger.error(err);
                return res.status(500).json({message: 'Failed to send message'});
            }
            firebaseService.performPushNotification(data._doc.to, {
                notification: {
                    title: `TopLance nowa wiadomosc`,
                    body: `${data._doc.content}`,
                    click_action: `${linkToPush}/message/${data._doc.from}`,
                    icon: "https://storage.cloud.google.com/toplance-842bb.appspot.com/logo.png?_ga=2.133323662.-1875057819.1521896601"
                }
            });
            delete data._doc.to;
            delete data._doc.from;
            delete data._doc.__v;
            data._doc.is_send = true;
            res.status(200).json({success: 'Message sent', message: data});
        });
    }

    getAll(req, res, next) {
        let userId = req.userID;
        let pageSize = req.query.pagesize || 10;
        let offset = req.query.page * pageSize || 0;

        Message.aggregate()
            .match({to: new mongoose.Types.ObjectId(userId)})
            .sort({send_date: 1})
            .group({
                _id: "$from",
                content: {$last: "$content"},
                send_date: {$last: "$send_date"},
                is_read: {$last: "$is_read"},

            })
            .exec((err, data) => {
                if(err) {
                    logger.error(err);
                    return res.status(500).json({message: 'Get messages'});
                }
                if(Object.keys(data).length > 0)  {
                    data = data.map(m => {
                        m.is_send = false;
                        return m;
                    });
                }

                Message.aggregate()
                    .match({from: new mongoose.Types.ObjectId(userId)})
                    .sort({send_date: 1})
                    .group({
                        _id: "$to",
                        content: {$last: "$content"},
                        send_date: {$last: "$send_date"},
                        is_read: {$last: "$is_read"},
                    })
                    .exec((err2, data2) => {
                        if(err2) {
                            logger.error(err);
                            return res.status(500).json({message: 'Failed to load messages'});
                        }

                        if(Object.keys(data2).length > 0)
                            data2 = data2.map(m => {
                                m.is_send = true;
                                return m;
                            });

                        let ret = [];

                        if(Object.keys(data).length > 0 && Object.keys(data2).length > 0)
                        ret = data2.concat(data);
                        else if(Object.keys(data).length > 0)
                            ret = data;
                        else if(Object.keys(data2).length > 0)
                            ret = data2;
                        else
                            return res.status(404).json({message: 'User does not have messages'});

                        ret = ret.filter((element, index, self) => {

                            return -1 === self.findIndex((t) => {
                                return t._id.equals(element._id) && ((element.send_date - t.send_date) < 0)
                            });

                        });

                        res.locals.num = ret.length;

                        ret.sort((msg1, msg2) => {
                            return msg2.send_date - msg1.send_date;
                        });

                        ret = ret.slice(offset, pageSize);

                        if(ret.length === 0)
                            res.status(404).json({message: 'Wrong page or page size number'});
                        else {
                            res.locals.messages = ret;
                            next();
                        }
                    });
            });
    }

    getAllWithOne(req, res) {
        let userId = new mongoose.Types.ObjectId(req.userID);
        let withId = new mongoose.Types.ObjectId(req.params.id);
        let pageSize = parseInt(req.query.pagesize) || 10;
        let offset = parseInt(req.query.page) * pageSize || 0;

        let countPrimise = new Promise((resolve, reject) => {
            Message.find({$or : [
                {$and: [{from: userId}, {to: withId}]},
                {$and: [{from: withId}, {to: userId}]}
            ]})
                .count()
                .exec((err, data) => {
                    if (err) {
                        logger.error(err);
                        reject({status: 500, msg: 'Failed to load messages'});
                    }

                    resolve(data);
                })
        });

        countPrimise.then((num) => {
            Message.find({
                $or : [
                    {$and: [{from: userId}, {to: withId}]},
                    {$and: [{from: withId}, {to: userId}]}
                ]
            })
                .sort([['send_date', -1]])
                .populate('from', 'username first_name last_name image')
                .populate('to', 'username first_name last_name image')
                .select('-__v')
                .skip(offset)
                .limit(pageSize)
                .exec((err, data) => {
                    if (err) {
                        logger.error(err);
                        return res.status(500).json({message: 'Failed to load messages'});
                    }

                    let userWith = res.locals.userData;
                    delete userWith._doc.create_date;
                    delete userWith._doc.email;
                    delete userWith._doc.status;
                    delete userWith._doc.city;
                    delete userWith._doc.phone;

                    let response = {
                        count: num,
                        with: userWith
                    };
                    if (num > 0) {
                        data.sort((msg1, msg2) => msg1.send_date - msg2.send_date);
                        let myData = data[0].from._id.equals(userId) ? data[0].from : data[0].to;
                        let msgs = data.map(msg => {
                            msg._doc.is_send = msg.from._id.equals(userId);
                            delete msg._doc.from;
                            delete msg._doc.to;
                            return msg;
                        });
                        response.me = myData;
                        response.messages = msgs;
                    }


                    res.status(200).json(response);


                    for(let rmsg of response.messages) {

                        if(!rmsg._doc.is_read && !rmsg._doc.is_send) {
                            Message.findByIdAndUpdate(rmsg._id, {is_read: true}, (err) => {
                                if(err) {
                                    logger.error(err);
                                }
                            });
                        }
                    }

                });
        }).catch((err) => res.status(err.status).json(err.msg));
    }

    sendMessageBot(req, res, next) {
        let toId = res.locals.userToId;
        let userId = req.userID;
        let text = `<strong> Witaj! </strong>
            <p> Jedna z Twoich ofet została właśnie zaakceptowana. </p>
            <p> Napisz do pracodawcy: <a href='/message/${userId}'>Kliknij tutaj!</a></p>
        `;

        let messageBody = {
            to: toId,
            from: topLance,
            content: text
        };

        Message.create(messageBody, (err, data) => {
            if(err) {
                logger.error(err);
                return res.status(500).json({message: 'Failed to send message'});
            }

            firebaseService.performPushNotification(data._doc.to, {
                notification: {
                    title: `TopLance nowa wiadomosc`,
                    body: `Twoja oferta została właśnie zaakceptowana`,
                    click_action: `${linkToPush}/message/${data._doc.from}`,
                    icon: "https://storage.cloud.google.com/toplance-842bb.appspot.com/logo.png?_ga=2.133323662.-1875057819.1521896601"
                }
            });

            next();
        });

    }

    getHasUnreadMessages(req, res, next) {
        let userId = req.params.id || req.userID;

        Message.find({to: userId, is_read: false}, (err, data) => {
            if(err) {
                logger.error(err);
                return res.status(500).json({message: 'Failed to load messages'});
            }

            res.locals.userData._doc.unread_messages = data.length;
            next();
        })
    }

}

module.exports = new messageService();