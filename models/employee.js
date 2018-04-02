const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let employeeSchema = new Schema({
    user_id: {type: Schema.Types.ObjectId, required:true, unique: true, ref: 'User'},
    description: String,
    portfolio_link: String,
    git_link: String,
    linked_in_link: String,
    salary: Number,
    education: {type: String},
    bids: [{type: Schema.Types.ObjectId, ref: 'Bid'}],
    languages: [{type: Schema.Types.ObjectId, ref: 'Language'}],
    software: [{type: Schema.Types.ObjectId, ref: 'Software'}],
    specs: [{type: Schema.Types.ObjectId, ref: 'Spec'}],
    certifications:  [{type: Schema.Types.ObjectId, ref: 'Certification'}],
    categories:  [{type: Schema.Types.ObjectId, ref: 'Category'}]
});

module.exports = mongoose.model('Employee', employeeSchema);