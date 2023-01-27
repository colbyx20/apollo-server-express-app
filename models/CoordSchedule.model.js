const{model,Schema,mongoose} = require('mongoose');

const coordScheduleSchema = new Schema({
    CoordinatorID:{type:mongoose.ObjectId},
    Room:{type:String},
    Schedule:{type:Array}
});
module.exports = model('CoordSchedule', coordScheduleSchema);