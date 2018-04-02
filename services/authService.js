const mongoose = require('mongoose'),
      jwt = require('jsonwebtoken'),
      logger = require('../config/logger'),
      bcrypt = require('bcrypt-nodejs'),
      config = require('../config/config'),
      user = require('../models/user');

class Auth {

    //post /auth/login
    loginUser(req, res) {
        let loginData = req.body;

        user.findOne({username: loginData.username}, (err, usr) => {
            if(err) {
                logger.error(err);
                return res.status(404).json({message: 'Internal error'});
            }
            if(!usr) {
                return res.status(404).json({message: 'User or password invalid'});
            }

            bcrypt.compare(loginData.password, usr.password, (err, answer) => {
                if(err || !answer) {
                    return res.status(404).json({message: 'User or password invalid'});
                }
                let payload = {
                    id: usr._id
                };

                let authToken = jwt.sign(payload, config.tokenPass);


                res.status(200).json({token: authToken, type: usr.status});
            });
        });
    }

    registerUser(req, res) {
        let registerData = req.body;

        let chceckPromise = new Promise((resolve, reject) => {
            user.findOne({username: registerData.username})
                .exec((err, data) => {
                    if(data)
                        reject('User with that name already exists');
                    else
                        user.findOne({email: registerData.email})
                            .exec((err, data) => {
                                if(data)
                                    reject('User with that email already exists');
                                else
                                    resolve();
                            });
                });
        });

        chceckPromise.then((d) => {
            bcrypt.hash(registerData.password, null, null, (err, hash) => {
                if(err) {
                    return res.json('500');
                }


                let newUser = new user({
                    _id: new mongoose.Types.ObjectId,
                    username: registerData.username,
                    password: hash,
                    email: registerData.email,
                    status: registerData.status
                });

                newUser.save((err) => {
                    if(err) {
                        logger.error(err);
                        return res.status(500).json({message: 'Something went wrong'});
                    }


                    let payload = {
                        id: newUser._id
                    };

                    let authToken = jwt.sign(payload, config.tokenPass);


                    res.status(200).json({token: authToken, type: newUser.status});
                });
            });
        })
            .catch((data) => {
                logger.error('Error with message ' + data);
                res.json({message: data});
            });

    }

    getUserID(req, res) {
        res.status(200).json({user_id: req.userID});
    }

    isEmailInUse(req, res) {
        let e_mail = req.body.email;
        user.findOne({email: e_mail}, (err , data) => {
            if(data)
                return res.json({message: 'Email already registered'});

            return res.status(200).json({success: 'good'});
        });
    }

    isNameInUse(req, res) {
        let user_name = req.body.username;
        user.findOne({username: user_name}, (err, data) => {
            if(data)
                return res.json({message: 'Name already in use'});

            return res.status(200).json({success: 'good'});
        })
    }

    authenticateUser(req, res, next) {
        if(!req.header('authorization'))
            return res.status(401).json({ message: 'Unauthorized. Missing Auth Header' });

        let token = req.header('authorization');

        let payload = jwt.decode(token, config.tokenPass);

        if(!payload)
            return res.status(401).json({ message: 'Unauthorized. Auth Header Invalid' });



        user.findById(payload.id, (err, user) => {
            if(err) {
                logger.error(err);
                return res.status(500).json({message: 'Internal error'});
            }
            if(!user) {
                return res.status(401).json({message: 'Wrong token'});
            }
                req.userID = payload.id;

                next();

        });

    }
}

module.exports = new Auth();