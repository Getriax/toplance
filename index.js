const express = require('express'),
    functions = require('firebase-functions'),
    bodyParser  = require('body-parser'),
    db = require('./services/database'),
    cors = require('cors'), //allow 3rd party
    busboy = require('connect-busboy'), //file manage
    config = require('./config/config'),
    router = require('./routes/routes'),
    logger = require('./config/logger'),
    auth = require('./controllers/api/auth/auth'),
    user = require('./controllers/api/user/user'),
    ask = require('./controllers/api/ask/ask'),
    company = require('./controllers/api/company/company'),
    employee = require('./controllers/api/employee/employee'),
    employer = require('./controllers/api/employer/employer'),
    message = require('./controllers/api/message/message'),
    bid = require('./controllers/api/bid/bid'),
    skills = require('./controllers/api/skills/skills');



    app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));

let routesMap = new Map();
    routesMap.set('auth', auth);
    routesMap.set('user', user);
    routesMap.set('ask', ask);
    routesMap.set('company', company);
    routesMap.set('employee', employee);
    routesMap.set('employer', employer);
    routesMap.set('message', message);
    routesMap.set('skills', skills);
    routesMap.set('bid', bid);


db.open(() => {console.log('Connection with database up')});

routesMap.forEach((obj, url) => {
    router.load(url, obj, app);
});

exports.app = functions.https.onRequest(app);
// class Server {
//     constructor() {
//         this.initMiddleware();
//         this.initDatabse();
//         this.initRoutes();
//         this.startFirebase();
//     //    this.startServer();
//     }
//     // startServer() {
//     //     app.listen(config.port, (err) => {
//     //         logger.info('Connected at port ' + config.port);
//     //     });
//     // }
//     initMiddleware() {
//         app.use(bodyParser.json());
//         app.use(cors());
//         app.use(bodyParser.urlencoded({extended: false}));
//         app.use('/image', express.static(__dirname + '/uploads'));
//     }
//     initRoutes() {
//         router.load(app, 'controllers');
//     }
//     initDatabse() {
//         db.open(() => {console.log('Connection with database up')});
//     }
//     startFirebase() {
//         exports.app = functions.https.onRequest(app);
//     }
// }
//
// module.exports = new Server();

