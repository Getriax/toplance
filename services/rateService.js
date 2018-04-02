const mongoose = require('mongoose'),
    Rate = require('../models/rate'),
    logger = require('../config/logger');

class RateService {
    createOrUpdate(req, res) {
        let userId = req.userID;
        let rateBody = req.body;

        rateBody.user_from = new mongoose.Types.ObjectId(userId);

        if(rateBody.user_from.equals(rateBody.user_to))
            res.status(409).json({message: 'You cannot rate yourself'});
        else {

            Rate.findOne({
                $and: [{user_from: rateBody.user_from, user_to: rateBody.user_to}]
            }, (err, data) => {
                if(err) {
                    logger.error(err);
                    return res.status(500).json({message: 'Failed to load rate'});
                }
                //If it's first time rating create new rate
                if(!data) {
                    Rate.create(rateBody, (err) => {
                        if(err) {
                            logger.error(err);
                            return res.status(500).json({message: 'Failed to create rate'});
                        }
                        return res.status(200).json({success: 'Rate created'});
                    });
                }
                //Else just update previous rate
                else {
                    Rate.findByIdAndUpdate(data._id, rateBody, (err) => {
                        if(err) {
                            logger.error(err);
                            return res.status(500).json({message: 'Failed to update rate'});
                        }
                        return res.status(200).json({success: 'Rate updated'});
                    });
                }
            });
        }
    }

    getAverage(req, res, next) {

        let userId = req.params.id || req.userID;
        userId = new mongoose.Types.ObjectId(userId);
        Rate.aggregate()
            .match({user_to: userId})
            .group({
                _id: "$user_to",
                avg: {$avg: "$grade"}
            })
            .exec((err, data) => {
                if(err) {
                    logger.error(err);
                    return res.status(500).json({message: 'Failed to load rate'});
                }
                if(Object.keys(data).length === 0)
                    res.locals.rate = 0;
                else
                    res.locals.rate = data[0].avg;

                next();
            });
    }

    getAllOfOne(req, res) {
        let userId = req.params.id;
        let pageSize = parseInt(req.query.pagesize) || 10;
        let offset = parseInt(req.query.page) * pageSize || 0;

        let countPromise = new Promise((resolve, reject) => {
            Rate.find({user_to: userId})
                .count()
                .exec((err, data) => {
                    if(err) {
                        logger.error(err);
                        reject({status: 500, msg: err});
                    }
                    if(!data || data === 0)
                        reject({status: 404, msg: 'User does not have rates yet'});

                    resolve(data);
                });
        });

        countPromise
            .then((num) => {
                Rate.find({user_to: userId})
                    .populate('user_from', 'username first_name last_name _id')
                    .skip(offset)
                    .limit(pageSize)
                    .select('-__v -_id')
                    .exec((err, data) => {
                        if(err) {
                            logger.error(err);
                            return res.status(500).json({message: 'Failed to load rate'});
                        }

                        let response = {
                            rates: data,
                            count: num
                        } ;

                        return res.status(200).json(response);
                    });
        })
            .catch((err) => res.status(err.status).json(err.msg));

    }
}

module.exports = new RateService();