const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let bidSchema = new Schema({
    employee: {type: Schema.Types.ObjectId, ref: 'Employee'},
    ask: {type: Schema.Types.ObjectId, ref: 'Ask'},
    description: String,
    salary: Number,
    create_date: {type: Date, default: Date.now },
    is_accepted: {type: Boolean, default: false}
});

module.exports = mongoose.model('Bid', bidSchema);