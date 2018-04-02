const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let rateSchema = new Schema({
    grade: {type: Number, min: 1, max: 5},
    description: String,
    create_date: {type: Date, default: Date.now },
    user_from: {type: Schema.Types.ObjectId, ref: 'User'},
    user_to: {type: Schema.Types.ObjectId, ref: 'User'}
});

module.exports = mongoose.model('Rate', rateSchema);