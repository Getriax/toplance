const mongoose = require('mongoose'),
    logger = require('../config/logger'),
    Employee = require('../models/employee');

class EmployeeService {

    create(req, res, next) {
        let userId = req.userID;

        Employee.create({user_id: userId}, (err) => {
            if(err) {
                logger.error(err);
                return res.status(500).json({message: 'Creating user failed'});
            }

            res.locals.msg = 'Employer created';

            next();
        });
    }


    getOne(req, res, next) {
        if(!res.locals.employee)
            return next();

        let userId = req.params.id || req.userID;

        Employee.findOne({user_id: userId})
            .select('-__v -user_id')
            .populate('languages', 'name -_id')
            .populate('software', 'name -_id')
            .populate('specs', 'name -_id')
            .populate('certifications', 'name -_id')
            .populate('categories', 'name -_id')
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
                result.employee = data;
                res.locals.result = result;
                res.locals.employeeID = data._id;
                next();
            }
            else
                res.status(200).json(result);
        });
    }


    getAll(req, res) {
        Employee.find()
            .populate('user_id')
            .exec((err, data) => {
                if(err)
                    return res.status(500).send({message: 'Employess not found'});

                res.status(200).json(data);
            });
    };



    update(req, res) {
        let userId = req.userID;
        let updateBody = req.body;


        Employee.findOneAndUpdate({user_id: userId}, updateBody)
            .exec((err, data) => {
                if(!data)
                    return res.status(404).json({message: 'Employee not found'});
                if(err)
                    return res.status(500).json({message: 'Cannot update employee'});

                res.status(200).json({success: 'Updated'});
            });
    }

    addBid(req, res, next) {
        let userId = req.userID;
        let bidId = new mongoose.Types.ObjectId;


        Employee.findOne({user_id: userId}, (err, data) => {
            if(err) {
                logger.error(err);
                return res.status(500).json({message: 'Adding bid failed'});
            }
            if(!data) {
                return res.status(404).json({message: 'Employee not found'});
            }

            data.bids.push(bidId);
            req.body.employee = data._id;

            data.save((err) => {
                if(err) {
                    logger.error(err);
                    return res.status(500).json({message: 'Adding bid failed'});
                }
                req.body._id = bidId;
                next();
            });
        });
    }

    getUserID(req, res, next) {
        let employeeId = res.locals.employeeID;

        Employee.findById(employeeId, (err, data) => {
            if(err) {
                logger.error(err);
                return res.status(500).json({message: 'Adding bid failed'});
            }
            if(!data) {
                return res.status(404).json({message: 'Bid creator does not exist'});
            }

            res.locals.userToId = data.user_id;
            next();
        })

    }
}



module.exports = new EmployeeService();