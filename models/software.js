const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let softwareSchema = new Schema({
    name: String,
});

module.exports = mongoose.model('Software', softwareSchema);