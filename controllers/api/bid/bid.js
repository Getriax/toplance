const authService = require('../../../services/authService'),
    bidService = require('../../../services/bidService'),
    employeeService = require('../../../services/employeeService'),
    employerService = require('../../../services/employerService'),
    messageService = require('../../../services/messageService'),
    askService = require('../../../services/askService');

class Manage {
    constructor(router) {

        router.post('/create/:id',
            authService.authenticateUser.bind(this),
            employeeService.addBid.bind(this),
            askService.addBid.bind(this),
            bidService.create.bind(this));

        router.post('/accept/:id',
            authService.authenticateUser.bind(this),
            bidService.getAskAndEmployeeID.bind(this), //get the id of ask and employee bid is related to
            employerService.acceptBid.bind(this), //check if accepted ask belongs to current user
            employeeService.getUserID.bind(this), //get the id of a user whom bid is being accepted
            messageService.sendMessageBot.bind(this), //send message to user whom bid is being accepted
            bidService.accept.bind(this)); //finally change the status of bid

    }
}

module.exports = Manage;