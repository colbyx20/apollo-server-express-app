const{model,Schema} = require('mongoose');

const adminSchema = new Schema({
    firstname: {type:String, require:true},
    lastname: {type:String, require:true},
    email:{type:String, require:true, unique: true},
    login: {type:String, require:true},
    password: {type:String, require:true},
    privilege: {type:Number, require:true},
    confirm:{type: Number},
    token: {type : String},
    image:{type:String}
});

module.exports = model('Admin', adminSchema);