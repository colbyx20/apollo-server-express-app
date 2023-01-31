const{model,Schema} = require('mongoose');

const coordinatorSchema = new Schema({
    coordinatorFName: {type:String, require:true},
    coordinatorLName: {type:String, require:true},
    availSchedule: {type: Array, default:[Date]},
    appointments: {type:Array}

});

module.exports = model("Coordinators", coordinatorSchema);