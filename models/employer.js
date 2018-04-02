const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let employerSchema = new Schema({
    user_id: {type: Schema.Types.ObjectId, ref: 'User'},
    asks: [{type: Schema.Types.ObjectId, ref: 'Ask'}],
    company: [{type: Schema.Types.ObjectId, ref: 'Company'}],
    git_link: String,
    linked_in_link: String,
});

module.exports = mongoose.model('Employer', employerSchema);