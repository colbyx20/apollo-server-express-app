const{model,Schema} = require('mongoose');

const professorSchema = new Schema({
    professorFName: {type:String, require:true},
    professorLName: {type:String, require:true},
    email:{type:String, require:true, unique: true},
    availSchedule: {type: Array},
    appointments: {type:Array},
    image:{type:String},
    coordinator: {type: Boolean},
    privilege: {
        type: String,
        require: true,
        enum:['user','professor','coordinator'],
        default:'professor' 
    }
});

module.exports = model('Professor',professorSchema);