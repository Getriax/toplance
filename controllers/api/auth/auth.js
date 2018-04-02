const authService = require('../../../services/authService');

class Some {
    constructor(router) {
        router.post('/login',
            authService.loginUser.bind(this));

        router.post('/register',
            authService.registerUser.bind(this));

        router.post('/check-email',
            authService.isEmailInUse.bind(this));

        router.post('/check-username',
            authService.isNameInUse.bind(this));


        router.get('/id',
            authService.authenticateUser.bind(this),
            authService.getUserID.bind(this));

    }
}

module.exports = Some;