const mongoose = require('mongoose'),
      Schema = mongoose.Schema;

let userSchema = new Schema({
    first_name: {type: String},
    last_name: {type: String},
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    create_date: [{type: Date, default: Date.now }],
    status: Number, // -1: just user, 0: employee, 1: employer
    phone: String,
    city: String,
    image: String,
    description: String
});

module.exports = mongoose.model('User', userSchema);