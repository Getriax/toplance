const mongoose = require('mongoose'),
    path = require('path'),
    User = require('../models/user'),
    logger = require('../config/logger'),
    bcrypt = require('bcrypt-nodejs'),
    Rate = require('../models/rate'),
    Busboy = require('busboy'),
    multer = require('../config/config').multer,
    fs = require('fs'),
    getRawBody = require('raw-body');
    contentType = require('content-type');
    GcsStorage = require('./firebaseService').getBucket(),
    uploadPath = require('../config/config').imagePath,
    limit = require('../config/config').imageLimit;


class UserService {


    update(req, res) {
        let userId = req.userID;
        let updateBody = req.body;


        let hashPromise = new Promise((resolve, reject) => {

            if(updateBody.password) {
                bcrypt.hash(password, null, null, (err, hash) => {
                    if(err) {
                        reject({message: 'Password encrypting failed'})
                    }
                    resolve(hash);
                });
            }
            else
                resolve(false);
        });
        hashPromise
            .then((hash) => {

            if(hash)
                updateBody.password = hash;

            User.findByIdAndUpdate(userId, updateBody, (err, data) => {
                if(err) {
                    logger.error(err);
                    return res.status(500).json({message: 'Adding bid failed'});
                }
                if(!data)
                    return res.status(404).json({message: 'User not found'});

                return res.status(200).json({success: res.locals.msg ||'User updated'});
            })

        })
            .catch((err) => {return res.status(500).json({message: err})});

    }

    getOne(req, res, next) {

        let userId = req.params.id || req.userID;

        User.findById(userId)
            .select('-__v -password -rate')
            .exec((err, data) => {
                if(err){
                    logger.error(err);
                    return res.status(500).send({message: 'Error while looking for user'});
                }

                if(data.status === 0) {
                    res.locals.employee = true;
                }
                else if(data.status === 1) {
                    res.locals.employer = true;
                }
                else {
                    data._doc.rate = res.locals.rate;
                    return res.status(200).json(data);
                }

                res.locals.userData = data;
                next();
            });
    }

    getAll(req, res) {
        User.find()
            .select('-_id -password -__v')
            .exec((err, body) => {
            if(err)
                return res.status(500).send({message: 'Something went wrong'});

            res.status(200).json(body);
        });
    }


    userMessages(req, res) {
        let messages = res.locals.messages;

        let idToNamesPromise = new Promise((resolve, reject) => {
            for(let element of messages) {
                User.findById(element._id, (err, data) => {
                   if(err) {
                       console.log(err);
                       logger.error(err);
                       reject(err);
                   }
                   if(!data) {
                       reject('User not found');
                   }
                    else {
                       element.username = data.username;
                       element.first_name = data.first_name;
                       element.last_name = data.last_name;
                       element.image = data.image || null;
                   }




                   if(element._id.equals(messages[messages.length - 1]._id)){
                       resolve();
                   }

                });
            }
        });

        idToNamesPromise.then(() => {
            res.status(200).json({
                messages: messages,
                count: res.locals.num
            });
        })
            .catch((err) => res.status(200).json({message: `${err}`}));
    }


    imageRemove(req, res, next) {
        let userId = req.userID;

        removeImg(userId)
            .then(() => {
                req.body.image = undefined;
                res.locals.msg = 'Image removed';
                next();
            })
            .catch((err) => {
                return res.status(err.status).json({message: err.msg});
            })
    }

    imgUpload(req, res, next) {
        console.log('Uploading image');
        let file = req.file;
        let userId = req.userID;
        console.log(file);
        if(!file) {
            return res.status(404).json({message: 'File not found'});
        }

        removeImg(userId)
            .then(() => {
                let extension = file.mimetype.split('/')[1];

                if(['jpg', 'png'].indexOf(extension) === -1)
                    return res.status(409).json({message: 'Wrong image extension, we support only jpg & png files'});

                let fileName = userId + '.' + extension;

                let fileUpload = GcsStorage.file(fileName);

                const uploadStream = fileUpload.createWriteStream({
                    metadata: {
                        contentType: file.mimetype
                    }
                });


                uploadStream.on('error', (err) => {
                    console.log(err);
                    return res.status(500).json({message: 'Upload failed'});
                });

                uploadStream.on('finish', () => {
                    console.log('Finishing upload');
                    req.body.image = `https://storage.googleapis.com/${GcsStorage.name}/${fileUpload.name}`;
                    res.locals.msg = 'Image updated';
                    next();
                });

                uploadStream.end(file.buffer);
            })
            .catch((err) => {
                logger.error(err);
                return res.status(500).json({message: 'Error uploading file'});
            });
    }

    imgUploadCheckMultipart(req, res, next) {
        console.log('Checking multipart');
        if(req.rawBody === undefined && req.method === 'POST' && req.headers['content-type'].startsWith('multipart/form-data')){
            getRawBody(req, {
                length: req.headers['content-length'],
                limit: '10mb',
                encoding: contentType.parse(req).parameters.charset
            }, function(err, string){
                if (err) return next(err);
                req.rawBody = string;
                next()
            })
        } else {
            next()
        }
    }

    imagePrepareWithBusboy(req, res, next) {
        console.log('Preparing with busboy');
        if (req.method === 'POST' && req.headers['content-type'].startsWith('multipart/form-data')) {
            const busboy = new Busboy({ headers: req.headers });
            let fileBuffer = new Buffer('');

            busboy.on('field', (fieldname, value) => {
                req.body[fieldname] = value
            });

            busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
                file.on('data', (data) => {
                    fileBuffer = Buffer.concat([fileBuffer, data])
                });

                file.on('end', () => {
                    const file_object = {
                        fieldname,
                        'originalname': filename,
                        encoding,
                        mimetype,
                        buffer: fileBuffer
                    };

                    req.file = file_object;
                })
            });

            busboy.on('finish', () => {
                next()
            });


            busboy.end(req.rawBody);
            req.pipe(busboy)
        } else {
            next()
        }
    }

}

function removeImg(userId) {
    console.log('Removing check');
    return new Promise((resolve, reject) => {
        User.findById(userId)
            .select('image -_id')
            .exec((err, data) => {
                console.log('remove image data ', data);
                if(err){
                    logger.error(err);
                    return reject({status: 500, msg: 'Error while looking for user'});
                }
                if(!data.image)
                    return resolve();
                else {
                    const fileName = data.image.split('/')[data.image.split('/').length - 1];
                    console.log('Removing image ' + fileName);
                    GcsStorage.file(fileName)
                        .delete()
                        .then(() => {
                            resolve();
                        })
                        .catch((err) => {console.log('Cannot remove image ', err); reject({status: 500, msg: 'Cannot remove image'})});
                }
            });

    });
}
module.exports = new UserService();