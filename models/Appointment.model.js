const {model, Schema, mongoose} = require('mongoose');

const appointmentSchema = new Schema({
    groupId:{type: mongoose.ObjectId},
    time:{type:String,require:true},
    attending:{type : [mongoose.ObjectId]}

});

module.exports = model('Appointment', appointmentSchema);