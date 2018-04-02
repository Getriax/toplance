const mongoose = require('mongoose'),
    Schema = mongoose.Schema;
companySchema = new Schema({
    employer: {type: Schema.Types.ObjectId, ref: 'Employer'},
    name: String,
    NIP: {type: String, unique: true},
    city: String
});

module.exports = mongoose.model('Company', companySchema);