const {model, Schema} = require('mongoose');

const groupSchema = new Schema({
    groupName: {type:String, require:true},
    groupProject: {type:String, require:true},
    projectField: {type:String, require:true}, // maybe turn this into an ENUM??
    memberCount:{type: Number, require:true},
    members:{type: Array, require:false},
    appointments: {type: Array}
})

module.exports = model("Group",groupSchema);