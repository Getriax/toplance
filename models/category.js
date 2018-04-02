const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let categorySchema = new Schema({
    name: String,
});


module.exports = mongoose.model('Category', categorySchema);