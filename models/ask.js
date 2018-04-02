const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let askSchema = new Schema({
    employer: {type: Schema.Types.ObjectId, ref: 'Employer'},
    bids: [{type: Schema.Types.ObjectId, ref: 'Bid'}],
    title: [{type: String, required: true}],
    description: String,
    salary: Number,
    work_time: Number,
    is_active: {type: Boolean, default: true},
    is_complete: {type: Boolean, default: false},
    create_date: {type: Date, default: Date.now },
    languages: [{type: Schema.Types.ObjectId, ref: 'Language'}],
    software: [{type: Schema.Types.ObjectId, ref: 'Software'}],
    specs: [{type: Schema.Types.ObjectId, ref: 'Spec'}],
    certifications:  [{type: Schema.Types.ObjectId, ref: 'Certification'}],
    categories:  [{type: Schema.Types.ObjectId, ref: 'Category'}]
});

module.exports = mongoose.model('Ask', askSchema);