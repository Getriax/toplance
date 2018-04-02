const authService = require('../../../services/authService'),
    employerService = require('../../../services/employerService');
    companyService = require('../../../services/companyService');


class Manage {
    constructor(router) {
        //router.get('/all', authService.authenticateUser.bind(this), employeeService.getAll.bind(this));

        router.get('/:id',
            authService.authenticateUser.bind(this),
            companyService.getOne.bind(this));

        router.post('/create',
            authService.authenticateUser.bind(this),
            companyService.checkIfCompanyAlreadyExists.bind(this),
            employerService.addCompany.bind(this),
            companyService.create.bind(this));

        router.post('/update/:id',
            authService.authenticateUser.bind(this),
            employerService.getId.bind(this),
            companyService.update.bind(this));

        router.delete('/delete/:id',
            authService.authenticateUser.bind(this),
            employerService.removeCompany.bind(this),
            companyService.remove.bind(this));

    }
}

module.exports = Manage;