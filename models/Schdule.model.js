const {model, Schema, mongoose} = require('mongoose');

const scheduleSchema = new Schema({
    professorId:{type: mongoose.ObjectId, require:true},
    availSchedule:{type: Date},
    appointments:{type: Array}
});

module.exports = model('Schedule', scheduleSchema);