const authService = require('../../../services/authService'),
    employeeService = require('../../../services/employeeService'),
    userService = require('../../../services/userService'),
    skillsService = require('../../../services/skillsService');


class Manage {
    constructor(router) {
        router.get('/all',
            authService.authenticateUser.bind(this),
            employeeService.getAll.bind(this));

        router.post('/create',
            authService.authenticateUser.bind(this),
            employeeService.create.bind(this),
            userService.update.bind(this));

        router.post('/update',
            authService.authenticateUser.bind(this),
            skillsService.changeNamesToIds.bind(this),
            employeeService.update.bind(this));
    }
}

module.exports = Manage;