const mongoose = require('mongoose'),
    logger = require('../config/logger'),
    Employer = require('../models/employer');

class EmployerService {

    create(req, res, next) {
        let userId = req.userID;

        Employer.create({user_id: userId}, (err) => {
            if(err) {
                logger.error(err);
                return res.status(500).json({message: 'Creating user failed'});
            }

            res.locals.msg = 'Employer created';

            next();
        });
    }

    update(req, res) {
        let userId = req.userID;
        let updateBody = req.body;

        Employer.findOneAndUpdate({user_id: userId}, updateBody)
            .exec((err, body) => {
                if(!body)
                    return req.status(404).json({message: 'Employer not found'});
                if(err)
                    return req.status(500).json({message: 'Cannot update employer'});

                return res.status(200).json({success: 'Employer updated'});
            });
    }

    getOne(req, res, next) {

        if(!res.locals.employer)
            return next();

        let userId = req.params.id || req.userID;

        Employer.findOne({user_id: userId})
            .select('-__v -user_id')
            .exec((err, data) => {
            if(err) {
                logger.error(err);
                return res.status(500).json({message: 'Error looking for employer'});
            }
            let result = {
                user: res.locals.userData,
                rate: res.locals.rate
            };
            if(data) {
                result.employer = data;
                res.locals.employerID = data._id;
                res.locals.result = result;
                next();
            }
            else
                res.status(200).json(result);
        });
    }



    createAsk(req, res, next) {
        let askId = new mongoose.Types.ObjectId;
        let userId = req.userID;

        Employer.findOne({user_id: userId}, (err, data) => {
            if(err) {
                logger.error(err);
                return res.status(500).json({message: 'Adding bid failed'});
            }
            if(!data) {
                return res.status(404).json({message: 'Employer not found'});
            }

            data.asks.push(askId);
            req.body.employer = data._id;
            data.save((err) => {
                if(err) {
                    logger.error(err);
                    return res.status(500).json({message: 'Adding bid failed'});
                }
                req.body._id = askId;
                next();
            });
        });

    }

    deleteAsk(req, res, next) {
        let userId = req.userID;
        let askID = req.params.id;

        Employer.findOne({user_id: userId}, (err, data) => {
            if(err) {
                logger.error(err);
                return res.status(500).json({message: 'Internal error'});
            }
            if(!data)
                return res.status(404).json({message: 'Employer not found'});

            data.asks = data.asks.filter(a => !a.equals(askID));

            data.save((err) => {
                if(err) {
                    logger.error(err);
                    return res.status(500).json({message: 'Failed saving ask'});
                }
                next();
            })

        });
    }

    getId(req, res, next) {
        let userId = req.userID;

        Employer.findOne({user_id: userId}, (err, data) => {
            if(err) {
                logger.error(err);
                return res.status(500).json({message: 'Internal error'});
            }

            if(data)
            req.employerID = data._id;

            next();
        });
    }

    addCompany(req, res, next) {
        let userId = req.userID;
        let companyId = new mongoose.Types.ObjectId;

        Employer.findOne({user_id: userId}, (err, data) => {
            if(err) {
                logger.error(err);
                return res.status(404).json({message: 'User not found'});
            }

            req.body._id = companyId;
            req.body.employer = data._id;

            data.company.push(companyId);

            data.save((err) => {
                if(err) {
                    logger.error(err);
                    return res.status(500).json({message: 'Internal error'});
                }
                next();
            });
        });
    }

    removeCompany(req, res, next) {
        let userId = req.userID;
        let companyId = req.params.id;


        Employer.findOne({user_id: userId})
            .populate('company')
            .exec((err, data) => {
            if(err) {
                logger.error(err);
                return res.status(500).json({message: 'Something went wrong'});
            }
            if(!data)
                return res.status(500).json({message: 'Employer with that company not found'});


                if(data.company.length > 1) {
                    data.company = data.company.filter(element => !element._id.equals(companyId) );
                }
                else {
                    data.company = [];
                }
                data.save((err) => {
                    if(err) {
                        logger.error(err);
                        return res.status(500).json({message: 'Fail while saving employer'});
                    }
                    next();
                });
            });
    }

    acceptBid(req, res, next) {
        let userId = req.userID;
        let askId = res.locals.askID;

        Employer.findOne({user_id: userId})
            .select('_id asks')
            .exec((err, data) => {
                if(err) {
                    logger.error(err);
                    return res.status(500).json({message: 'Something went wrong'});
                }
                if(!data)
                    return res.status(404).json({message: 'Employer with that id not found'});

                if(data.asks.filter(askID => askID.equals(askId)).length === 1) {
                    next();
                }
                else {
                    return res.status(401).json({message: 'You are not authorized to do that'});
                }
            })
    }
}

module.exports = new EmployerService();