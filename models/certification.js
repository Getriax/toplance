const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let certificationSchema = new Schema({
    name: String,
});

module.exports = mongoose.model('Certification', certificationSchema);