const admin = require('firebase-admin'),
    functions = require('firebase-functions'),
    config = require('../config/config'),
    pushConfig = require('../config/toplance-bc42093e9735'),
    gcloud = require('@google-cloud/storage');

    admin.initializeApp({
        credential: admin.credential.cert(pushConfig),
        databaseURL: 'https://toplance-842bb.firebaseio.com/'
    });

class firebaseService {

    getBucket() {
        const gcs = new gcloud(config.firebaseConfig);
        return gcs.bucket('toplance-842bb.appspot.com');
    }

    performPushNotification(userToId, payload) {
        admin.database()
            .ref(`/fcmTokens/${userToId}`)
            .once('value')
            .then(token => token.val())
            .then(userFcmToken => {
                return admin.messaging().sendToDevice(userFcmToken, payload)
            })
            .then(res => {
                console.log('Push notification successful ', res);
            })
            .catch((err) => {
                console.log('Push unsuccessful ' , err);
            });
    }
}

module.exports = new firebaseService();



