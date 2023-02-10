const{model,Schema,mongoose} = require('mongoose');

const coordScheduleSchema = new Schema({
    coordinatorID:mongoose.ObjectId,
    room:{type:String},
    groupId:{type: mongoose.ObjectId},
    time:{type:Date,require:true},
    attending:{type : [mongoose.ObjectId]}

});
module.exports = model('CoordSchedule', coordScheduleSchema);