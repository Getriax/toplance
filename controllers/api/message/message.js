const authService = require('../../../services/authService'),
    messageService = require('../../../services/messageService'),
    userService = require('../../../services/userService'),
    skillsService = require('../../../services/skillsService');

class Manage {
    constructor(router) {

        router.post('/send',
            authService.authenticateUser.bind(this),
            messageService.send.bind(this));

        router.get('/all',
            authService.authenticateUser.bind(this),
            messageService.getAll.bind(this),
            userService.userMessages.bind(this));

        router.get('/with/:id',
            authService.authenticateUser.bind(this),
            userService.getOne.bind(this),
            messageService.getAllWithOne.bind(this));
    }
}

module.exports = Manage;

/**
 let langs = req.query.languages;
 let soft = req.query.software;

 let data = {
                l: langs,
                s: soft,
            };
 req.query.a = 'c';
 let d2 = Object.keys(req.body).length > 0 ? req.body : req.query;

 let d3 = req.body.a || req.query.a;
 res.status(200).json(d3);
 */