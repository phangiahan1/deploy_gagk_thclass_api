const mongoose = require('mongoose');

const Classeschema = mongoose.Schema({
    classname:String,
    section:String,
    subject:String,
    room: String,
    owner: String
}, {
    timestamps: true
});

module.exports = mongoose.model('Classroom', Classeschema);