const{model,Schema} = require('mongoose');

const coordinatorSchema = new Schema({
    firstname:{type:String},
    lastname:{type:String},
    email:{type:String},
    password:{type:String},
    confirm:{type: Number}, // maybe turn this into a Boolean
    privilege:{type:Number},  // starting to think we don't need this
    token:{type:String},
    image:{type:String}, 
    groups:{type:Array},
    schedule:{type:Array}

});

module.exports = model("Coordinators", coordinatorSchema);