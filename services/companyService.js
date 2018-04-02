const mongoose = require('mongoose'),
    Employer = require('../models/employer'),
    logger = require('../config/logger'),
    Company = require('../models/company');

class CompanyService {

    create(req, res) {
        let companyBody = req.body;

        Company.create(companyBody, (err) => {
            if(err) {
                logger.error(err);
                return res.status(500).json({message: 'Company save went wrong'});
            }
            return res.status(200).json({success: 'Company created'});
        });

    }

    remove(req, res) {
        let companyId = req.params.id;

        Company.findByIdAndRemove(companyId, (err) => {
            if(err)  {
                console.error(err);
                return res.status(500).json({message: 'Failed while removing company'});
            }

            return res.status(200).json({success: `Company deleted`});
        });
    }

    update(req, res) {
        let companyId = req.params.id;
        let companyUpdate = req.body;


        Company.findByIdAndUpdate(companyId, companyUpdate, (err, data) => {
            if(err) {
                console.error(err);
                return res.status(500).json({message: 'Failed while looking for company'});
            }
            return res.status(200).json({success: `Company updated`});
        });
    }

    checkIfCompanyAlreadyExists(req, res, next) {
        let companyNIP = req.body.NIP;
        Company.findOne({NIP: companyNIP}, (err, body) => {
            if(body)
                return res.status(409).json({message: 'Comapny with that NIP already exists'});

            next();
        })
    }

    getOne(req, res) {
        let companyId = req.params.id;

        Company.findById(companyId)
            .select('-__v')
            .exec((err, data) => {
            if(err) {
                logger.error(err);
                return res.status(500).json({message: 'Internal error'});
            }

            if(!data)
                return res.status(404).json({message: 'Company with that id does not exist'});

            res.status(200).json(data);
        });
    }

    getAllOfEmployer(req, res) {
        let employerId = req.params.id || req.employerID;

        Company.find({employer: employerId})
            .select('-__v')
            .exec((err, data) => {

            if(err) {
                logger.error(err);
                return res.status(500).json({message: 'Internal error'});
            }

            if(!data)
                return res.status(404).json({message: 'This user does not have any companies'});

            res.status(200).json(data);
        });
    }
}

module.exports = new CompanyService();