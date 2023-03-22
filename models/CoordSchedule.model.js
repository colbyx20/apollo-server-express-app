const { model, Schema, mongoose } = require('mongoose');
const { Group } = require("./Group.model");

const subProfessors = new Schema({
    _id: { type: Schema.Types.ObjectId },
    fullName: { type: String }
})

const coordScheduleSchema = new Schema({
    coordinatorID: Schema.Types.ObjectId,
    room: { type: String },
    groupId: { type: Schema.Types.ObjectId, ref: 'Group', default: null },// scrapping this as i cannot controll the _id of an object and therefore cannot verify that im can pick an unused ID
    time: { type: Date, require: true },
    numberOfAttending: { type: Number },
    attending: { type: [Schema.Types.ObjectId] },
    attending2: { type: [subProfessors] }


});
module.exports = model('CoordSchedule', coordScheduleSchema);