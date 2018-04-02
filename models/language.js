const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let languageSchema = new Schema({
    name: String,
});

module.exports = mongoose.model('Language', languageSchema);