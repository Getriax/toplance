const mongoose = require('mongoose'),
    logger = require('../config/logger'),
    Ask = require('../models/ask');

class AskService {

    create(req, res) {
        let askBody = req.body;

        Ask.create(askBody, (err) => {
            if(err) {
                logger.error(err);
                return res.status(500).json({message: 'Failed creating ask'});
            }

            return res.status(200).json({message: 'Created'});
        });


    }

    update(req, res) {
        let updateBody = req.body;
        let askID = req.params.id;


        Ask.findByIdAndUpdate(askID, updateBody, (err, data) => {
            if(!data)
                return res.status(404).json({message: 'Wrong ask id'});
            if(err)
                return res.status(500).json({message: 'Internal error'});

            return res.status(200).json({message: 'Updated'});
        });
    }

    remove(req, res) {
        let askID = req.params.id;

        Ask.findByIdAndRemove(askID, (err, data) => {

                if(err) {
                    logger.error(err);
                    return res.status(500).json({message: 'Internal error'});
                }
                if(!data)
                    return res.status(404).json({message: 'Ask not found'});

                return res.status(200).json({message: 'Removed'});


        });
    }


    getAllLimit(req, res) {

        let pageSize = parseInt(req.query.pagesize) || 10;
        let offset = parseInt(req.query.page) * pageSize || 0;


        let askQuery = Ask.find();
        let countQuery = Ask.find();


        if(res.locals.languages) {
            askQuery
                .where('languages').in(res.locals.languages);
            countQuery
                .where('languages').in(res.locals.languages);
        }
        if(res.locals.categories) {
            askQuery
                .where('categories').in(res.locals.categories);
            countQuery
                .where('categories').in(res.locals.categories);
        }
        if(res.locals.software) {
            askQuery
                .where('software').in(res.locals.software);
            countQuery
                .where('software').in(res.locals.software);
        }
        if(res.locals.specs) {
            askQuery
                .where('specs').in(res.locals.specs);
            countQuery
                .where('specs').in(res.locals.specs);
        }
        if(res.locals.certifications) {
            askQuery
                .where('certifications').in(res.locals.certifications);
            countQuery
                .where('certifications').in(res.locals.certifications);
        }

        countQuery.count().exec((err, amount) => {
            if(err) {
                logger.error(err);
                return res.status(500).json({message: 'Internal error'});
            }
            if(!amount)
                return res.status(404).json({message: 'Asks not found, try changing filters'});

            askQuery
                .skip(offset)
                .limit(pageSize)
                .populate('employer', 'user_id')
                .populate('languages', 'name -_id')
                .populate('software', 'name -_id')
                .populate('specs', 'name -_id')
                .populate('certifications', 'name -_id')
                .populate('categories', 'name -_id')
                .select('-__v');

            askQuery.exec((err, data) => {
                if(err) {
                    logger.error(err);
                    return res.status(500).json({message: 'Internal error'});
                }


                data = data.map(el => {
                    el._doc.bids = el.bids.length;
                    return el;
                });


                let responseData = {
                   count: amount,
                   asks: data
                };
                res.status(200).json(responseData);
            })
        });

    }

    getOne(req, res, next) {
        let askId = req.params.id;

        Ask.findById(askId)
            .populate('employer', '_id user_id')
            .populate('languages', 'name -_id')
            .populate('software', 'name -_id')
            .populate('specs', 'name -_id')
            .populate('certifications', 'name -_id')
            .populate('categories', 'name -_id')
            .select('-__v')
            .exec((err, data) => {
                if(err) {
                    logger.error(err);
                    return res.status(500).json({message: 'Internal error'});
                }

                if(!data)
                    return res.status(404).json({message: 'Ask not found'});

                res.locals.ask = data;

                if(data.bids.length > 0) {
                    next();
                }
                else {
                    res.status(200).json({
                        ask: data,
                        bids: 0
                    })
                }
            });
    }

    addBid(req, res, next) {
        let bidId = req.body._id;
        let askId = req.params.id;

        Ask.findById(askId, (err, data) => {
            if(err) {
                logger.error(err);
                return res.status(500).json({message: 'Internal error'});
            }

            if(!data)
                return res.status(404).json({message: 'Ask not found'});

            req.body.ask = data._id;
            data.bids.push(bidId);

            data.save((err) => {
                if(err) {
                    logger.error(err);
                    return res.status(500).json({message: 'Failed saving ask'});
                }
                next();
            });
        })
    }

    getAllOfEmployer(req, res) {
        let employerId = req.employerID || req.params.id;

        Ask.find({employer: employerId})
            .populate('languages', 'name -_id')
            .populate('software', 'name -_id')
            .populate('specs', 'name -_id')
            .populate('certifications', 'name -_id')
            .populate('categories', 'name -_id')
            .select('-__v')
            .exec((err, data) => {
            if(err) {
                logger.error(err);
                return res.status(500).json({message: 'Internal error'});
            }

            if(!data)
                return res.status(404).json({message: 'This user does not have any asks'});

            res.status(200).json(data);
        });
    }

    getUserAsksOrBidStatus(req, res) {
        if(res.locals.employerID) {
            let employerID = res.locals.employerID;
            Ask.find({employer: employerID})
                .exec((err, data) => {
                    if(err) {
                        logger.error(err);
                        return res.status(500).json({message: 'Internal error while looking for employer'});
                    }
                    let result = res.locals.result;

                    if(data) {
                        let active_asks = data.filter(ask => ask.is_active).length;
                        let finished_asks = data.filter(ask => ask.is_complete).length;
                        let in_progress_asks = data.filter(ask => !ask.is_active && !ask.is_complete).length;

                        result.employer._doc.active_asks = active_asks;
                        result.employer._doc.finished_asks = finished_asks;
                        result.employer._doc.in_progress_asks = in_progress_asks;
                    }


                    res.status(200).json(result);
                });
        }
        else {
            //Count active and finished asks
            let activeAsksPromise = new Promise((resolve, reject) => {
                let returnAsks = {
                    active: 0,
                    finished: 0
                };
                if(!res.locals.accepted_asks)
                    resolve(returnAsks);
                else {

                    Ask.find({
                        _id: {$in: res.locals.accepted_asks}
                    }, (err, data) => {
                        if(err) {
                            logger.error(err);
                            reject({status: 500, msg: 'Error while looking for asks'});
                        }

                        if(Object.keys(data).length === 0)
                            resolve(returnAsks);



                        returnAsks.active = data.filter(ask => !ask.is_complete).length;
                        returnAsks.finished = data.filter(ask => ask.is_complete).length;


                        resolve(returnAsks);
                    });
                }
            });

            activeAsksPromise
                .then((data) => {
                    let result = res.locals.result;
                    result.employee._doc.finished_asks = data.finished;
                    result.employee._doc.in_progress_asks = data.active;
                    result.employee._doc.waiting_asks = res.locals.waiting_asks ? res.locals.waiting_asks.length : 0;

                    return res.status(200).json(result);
                })
                .catch((err) =>{ res.status(err.status || 500).json({message: err.msg || err}); }
                );
        }




    }

}

module.exports = new AskService();
