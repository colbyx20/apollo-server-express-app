const{model,Schema} = require('mongoose');

const professorSchema = new Schema({
    firstname: {type:String, require:true},
    lastname: {type:String, require:true},
    email:{type:String, require:true, unique: true},
    login: {type:String, require:true},
    password: {type:String, require:true},
    privilege: {type:Number, require:true},
    fieldOfInterest: {type:String, require:true},
    token: {type : String},
    schedule: {type: Array, require:false},
    appointments: {type:Array, require:false},
    confirm:{type: Number},
});

module.exports = model('Professor',professorSchema);