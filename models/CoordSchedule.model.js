const{model,Schema,mongoose} = require('mongoose');

const coordScheduleSchema = new Schema({
    coordinatorID:mongoose.ObjectId,
    room:{type:String},
    // groupId:{type: mongoose.ObjectId},
    groupId:{type: Number},
    time:{type:Date,require:true},
    numberOfAttending: {type:Number},
    attending:{type : [mongoose.ObjectId]}


});
module.exports = model('CoordSchedule', coordScheduleSchema);