const{model,Schema} = require('mongoose');

const professorSchema = new Schema({
    professorFName: {type:String, require:true},
    professorLName: {type:String, require:true},
    availSchedule: {type: Array, default:[Date]},
    appointments: {type:Array}
});

module.exports = model('Professor',professorSchema);