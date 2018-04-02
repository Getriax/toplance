const authService = require('../../../services/authService'),
    rateService = require('../../../services/rateService'),
    employeeService = require('../../../services/employeeService'),
    employerService = require('../../../services/employerService'),
    messageService = require('../../../services/messageService'),
    multer = require('../../../config/config').multer;
    bidService = require('../../../services/bidService'),
    askService = require('../../../services/askService'),
    userService = require('../../../services/userService');

class Manage {
    constructor(router) {
        router.get('/all',
            authService.authenticateUser.bind(this),
            userService.getAll.bind(this));

        router.get('/me',
            authService.authenticateUser.bind(this),
            rateService.getAverage.bind(this),
            userService.getOne.bind(this),
            messageService.getHasUnreadMessages.bind(this),
            employeeService.getOne.bind(this),
            bidService.getAccepted.bind(this),
            bidService.getWaiting.bind(this),
            employerService.getOne.bind(this),
            askService.getUserAsksOrBidStatus.bind(this));

        router.get('/:id',
            authService.authenticateUser.bind(this),
            rateService.getAverage.bind(this),
            userService.getOne.bind(this),
            messageService.getHasUnreadMessages.bind(this),
            employeeService.getOne.bind(this),
            bidService.getAccepted.bind(this),
            bidService.getWaiting.bind(this),
            employerService.getOne.bind(this),
            askService.getUserAsksOrBidStatus.bind(this));

        router.get('/:id/rates',
            authService.authenticateUser.bind(this),
            rateService.getAllOfOne.bind(this));


        router.post('/update',
            authService.authenticateUser.bind(this),
            userService.update.bind(this));

        router.post('/rate',
            authService.authenticateUser.bind(this),
            rateService.createOrUpdate.bind(this));

        router.post('/image/upload',
            authService.authenticateUser.bind(this),
            userService.imgUploadCheckMultipart.bind(this),
            userService.imagePrepareWithBusboy.bind(this),
            userService.imgUpload.bind(this),
            userService.update.bind(this));

        router.delete('/image/remove',
            authService.authenticateUser.bind(this),
            userService.imageRemove.bind(this),
            userService.update.bind(this));
    }
}

module.exports = Manage;