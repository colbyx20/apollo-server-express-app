const { model, Schema, mongoose } = require('mongoose');

const subProfessors = new Schema({
    _id: { type: Schema.Types.ObjectId },
    fullName: { type: String }
})

const coordScheduleSchema = new Schema({
    coordinatorID: Schema.Types.ObjectId,
    room: { type: String },
    groupId: { type: Schema.Types.ObjectId },
    time: { type: Date, require: true },
    numberOfAttending: { type: Number },
    attending: { type: [Schema.Types.ObjectId] },
    attending2: { type: [subProfessors] }


});
module.exports = model('CoordSchedule', coordScheduleSchema);