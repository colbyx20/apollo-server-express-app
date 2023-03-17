const { model, Schema, mongoose } = require('mongoose');

const subProfessors = new Schema({
    _id: { type: Schema.Types.ObjectId },
    fullName: { type: String }
})

const coordScheduleSchema = new Schema({
    coordinatorID: Schema.Types.ObjectId,
    room: { type: String },
    //groupId clicks better in my head but do to the nature of 
    groupId: { type: Schema.Types.ObjectId, default: null },// scrapping this as i cannot controll the _id of an object and therefore cannot verify that im can pick an unused ID
    //groupNumber:{type: Number, min:1}, 
    //p.s. if your going to make a change like this notify me
    time: { type: Date, require: true },
    numberOfAttending: { type: Number },
    attending: { type: [Schema.Types.ObjectId] },
    attending2: { type: [subProfessors] }


});
module.exports = model('CoordSchedule', coordScheduleSchema);