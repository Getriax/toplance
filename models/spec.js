const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let specSchema = new Schema({
    name: String,
});

module.exports = mongoose.model('Spec', specSchema);