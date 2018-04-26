const mongoose = require('mongoose'),
    logger = require('../config/logger'),
    Language = require('../models/language'),
    Software = require('../models/software'),
    Spec = require('../models/spec'),
    Certification = require('../models/certification'),
    Category = require('../models/category');

class SkillsService {

    getAllLanguages(req, res) {
        Language.find()
            .select('name level -_id')
            .exec((err, data) => {
                if(err) {
                    logger.error(err);
                    return res.status(500).send({message: 'Cannot get languages'});
                }

                res.json(data);
            });
    }
    getAllSpecializations(req, res) {
        Spec.find()
            .select('name level -_id')
            .exec((err, data) => {
                if(err) {
                    logger.error(err);
                    return res.status(500).send({message: 'Cannot get specializations'});
                }

                res.json(data);
            });
    }
    getAllSoftware(req, res) {
        Software.find()
            .select('name level -_id')
            .exec((err, data) => {
                if(err) {
                    logger.error(err);
                    return res.status(500).send({message: 'Cannot get software'});
                }

                res.json(data);
            });
    }
    getAllCertifications(req, res) {
        Certification.find()
            .select('name -_id')
            .exec((err, data) => {
                if(err) {
                    logger.error(err);
                    return res.status(500).send({message: 'Cannot get certifications'});
                }

                res.json(data);
            });
    }
    getAllCategories(req, res) {
        Category.find()
            .select('name -_id')
            .exec((err, data) => {
                if(err) {
                    logger.error(err);
                    return res.status(500).send({message: 'Cannot get categories'});
                }

                res.json(data);
            });
    }
    languagesNamesToIds(req, res, next) {

        if(!req.query.languages)  {
            next();
        }
        else {


            if (!(req.query.languages instanceof Array))
                req.query.languages = [req.query.languages];

            let idPromise = new Promise((resolve, reject) => {
                let ids = [];
                for (let n of req.query.languages) {
                    Language.findOne({name: n}, (err, data) => {
                        if (err) {
                            logger.error(err);
                            return reject(err);
                        }
                        if (!data)
                            return reject('We do not support that 0');
                        ids.push(new mongoose.Types.ObjectId(data._id));
                        if (ids.length === req.query.languages.length)
                            resolve(ids);
                    });
                }
            });

            idPromise.then(IDS => {
                res.locals.languages = IDS;
                next();
            })
                .catch((err) => {
                    return res.status(409).json({message: err + 'halo'})
                });
        }
    }
    categoriesNamesToIds(req, res, next) {


        if(!req.query.categories) {
            next();
        }
        else {

            if (!(req.query.categories instanceof Array))
                req.query.categories = [req.query.categories];

            let idPromise = new Promise((resolve, reject) => {
                let ids = [];
                for (let n of req.query.categories) {
                    Category.findOne({name: n}, (err, data) => {
                        if (err) {
                            logger.error(err);
                            reject(err);
                            return;
                        }
                        if (!data) {
                            reject('We do not support that 1');
                            return;
                        }

                        ids.push(new mongoose.Types.ObjectId(data._id));
                        if (ids.length === req.query.categories.length)
                            resolve(ids);
                    });
                }
            });

            idPromise.then(IDS => {
                res.locals.categories = IDS;
                next();
            })
                .catch((err) => {
                    return res.status(409).json({message: err})
                });
        }
    }
    softwareNamesToIds(req, res, next) {

        if(!req.query.software)  {
            next();
        }
        else {

            if (!(req.query.software instanceof Array))
                req.query.software = [req.query.software];

            let idPromise = new Promise((resolve, reject) => {
                let ids = [];
                for (let n of req.query.software) {
                    Software.findOne({name: n}, (err, data) => {
                        if (err) {
                            logger.error(err);
                            return reject(err);
                        }
                        if (!data)
                            return reject('We do not support that 2');
                        ids.push(new mongoose.Types.ObjectId(data._id));
                        if (ids.length === req.query.software.length)
                            resolve(ids);
                    });
                }
            });

            idPromise.then(IDS => {
                res.locals.software = IDS;
                next();
            })
                .catch((err) => {
                    return res.status(409).json({message: err})
                });
        }
    }
    specsNamesToIds(req, res, next) {

        if(!req.query.specs)  {
            next();
        }
        else {


            if (!(req.query.specs instanceof Array))
                req.query.specs = [req.query.specs];

            let idPromise = new Promise((resolve, reject) => {
                let ids = [];
                for (let n of req.query.specs) {
                    Spec.findOne({name: n}, (err, data) => {
                        if (err) {
                            logger.error(err);
                            return reject(err);
                        }
                        if (!data)
                            return reject('We do not support that 3');
                        ids.push(new mongoose.Types.ObjectId(data._id));
                        if (ids.length === req.query.specs.length)
                            resolve(ids);
                    });
                }
            });

            idPromise.then(IDS => {
                res.locals.specs = IDS;
                next();
            })
                .catch((err) => {
                    return res.status(409).json({message: err})
                });
        }
    }

    certificationsNamesToIds(req, res, next) {

        if(!req.query.certifications)  {
            next();
        }
        else {


            if (!(req.query.certifications instanceof Array))
                req.query.certifications = [req.query.certifications];

            let idPromise = new Promise((resolve, reject) => {
                let ids = [];
                for (let n of req.query.certifications) {
                    Certification.findOne({name: n}, (err, data) => {
                        if (err) {
                            logger.error(err);
                            return reject(err);
                        }
                        if (!data)
                            return reject('We do not support that 4');
                        ids.push(new mongoose.Types.ObjectId(data._id));
                        if (ids.length === req.query.certifications.length)
                            resolve(ids);
                    });
                }
            });

            idPromise.then(IDS => {
                res.locals.certifications = IDS;
                next();
            })
                .catch((err) => {
                    return res.status(409).json({message: err})
                });
        }
    }


    changeNamesToIdsGET(req, res, next) {

        let propertiesMap = new Map();
        let lastProperty = null;
        let nextError = false;


        if(req.query.categories) {
            propertiesMap.set('categories', Category);
            lastProperty = 'categories';
            res.locals.categories =[];
            if(!(req.query.categories instanceof Array))
                req.query.categories = [req.query.categories];
        }
        if(req.query.languages && req.query.languages.length > 0) {
            propertiesMap.set('languages', Language);
            lastProperty = 'languages';
            res.locals.languages = [];
            if(!(req.query.languages instanceof Array))
                req.query.languages = [req.query.languages];
        }
        if(req.query.software && req.query.software.length > 0) {
            propertiesMap.set('software', Software);
            lastProperty = 'software';
            res.locals.software =[];
            if(!(req.query.software instanceof Array))
                req.query.software = [req.query.software];
        }
        if(req.query.specs && req.query.specs.length > 0) {
            propertiesMap.set('specs', Spec);
            lastProperty = 'specs';
            res.locals.specs =[];
            if(!(req.query.specs instanceof Array))
                req.query.specs = [req.query.specs];
        }
        if(req.query.certifications && req.query.certifications.length > 0) {
            propertiesMap.set('certifications', Certification);
            lastProperty = 'certifications';
            res.locals.certifications =[];
            if(!(req.query.certifications instanceof Array))
                req.query.certifications = [req.query.certifications];
        }
        if(lastProperty === null) {
            next();
        }



        for(let [name, object] of propertiesMap) {


            let idPromise = new Promise((resolve, reject) => {
                let ids = new Array();
                for(let n of req.query[name]) {

                    object.findOne({name: n}, (err, data) => {

                        if(err) {

                            logger.error(err);
                            return reject(err);
                        }
                        if(!data)
                            return reject('We do not support that');
                        ids.push(new mongoose.Types.ObjectId(data._id));
                        if(ids.length === req.query[name].length)
                            resolve(ids);


                    });
                }
            });

            idPromise
                .then((ids) => {
                    res.locals[name] = ids;
                    if(name === lastProperty && !nextError)
                        next();

                })
                .catch((err) => {
                    nextError = true;
                    logger.error(err);
                    return res.status(409).json({message: err});
                });
        }
    }

    changeNamesToIds(req, res, next) {

        let propertiesMap = new Map();
        let lastProperty = null;
        let nextError = false;


        if(req.body.categories && req.body.categories.length > 0) {
            propertiesMap.set('categories', Category);
            lastProperty = 'categories';
        }
        if(req.body.languages && req.body.languages.length > 0) {
            propertiesMap.set('languages', Language);
            lastProperty = 'languages';
        }
        if(req.body.software && req.body.software.length > 0) {
            propertiesMap.set('software', Software);
            lastProperty = 'software';
        }
        if(req.body.specs && req.body.specs.length > 0) {
            propertiesMap.set('specs', Spec);
            lastProperty = 'specs';
        }
        if(req.body.certifications && req.body.certifications.length > 0) {
            propertiesMap.set('certifications', Certification);
            lastProperty = 'certifications';
        }
        if(lastProperty === null)
            next();

        for(let [name, object] of propertiesMap) {


            let idPromise = new Promise((resolve, reject) => {
                let ids = new Array();
                for(let n of req.body[name]) {

                        object.findOne({name: n}, (err, data) => {

                            if(err) {

                                logger.error(err);
                                return reject(err);
                            }
                            if(!data)
                                return reject('We do not support that');
                            ids.push(data._id);
                            if(ids.length === req.body[name].length)
                                resolve(ids);


                        });
                }
            });

            idPromise
                .then((ids) => {
                    req.body[name] = ids;
                    if(name === lastProperty && !nextError)
                        next();

                })
                .catch((err) => {
                    nextError = true;
                    logger.error(err);
                    return res.status(409).json({message: err});
                });
        }
    }

}
function contains(table, value) {
    for(let tVal of table) {
        if(tVal == value)
            return true;
    }
    return false;
}
module.exports = new SkillsService();
