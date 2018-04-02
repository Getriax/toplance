const authService = require('../../../services/authService'),
    skillsService = require('../../../services/skillsService'),
    askService = require('../../../services/askService'),
    bidService = require('../../../services/bidService'),
    employerService = require('../../../services/employerService');

class Manage {
    constructor(router) {
       router.get('/all',
           authService.authenticateUser.bind(this),
           skillsService.languagesNamesToIds.bind(this),
           skillsService.categoriesNamesToIds.bind(this),
           skillsService.softwareNamesToIds.bind(this),
           skillsService.specsNamesToIds.bind(this),
           skillsService.certificationsNamesToIds.bind(this),
           askService.getAllLimit.bind(this));

       router.get('/:id',
           authService.authenticateUser.bind(this),
           askService.getOne.bind(this),
           bidService.populateBids.bind(this));


       router.post('/create',
           authService.authenticateUser.bind(this),
           skillsService.changeNamesToIds.bind(this),
           employerService.createAsk.bind(this),
           askService.create.bind(this));

       router.post('/update/:id',
           authService.authenticateUser.bind(this),
           skillsService.changeNamesToIds.bind(this),
           employerService.getId.bind(this),
           askService.update.bind(this));

       router.delete('/delete/:id',
           authService.authenticateUser.bind(this),
           skillsService.changeNamesToIds.bind(this),
           employerService.deleteAsk.bind(this),
           askService.remove.bind(this),
           bidService.removeBids.bind(this));
    }
}

module.exports = Manage;