const { model, Schema, mongoose } = require('mongoose');
const Users = require("./Users.model");

const groupSchema = new Schema({
    coordinatorId: mongoose.ObjectId,
    groupName: { type: String, require: true, unique: true },
    projectField: { type: String, require: true }, // maybe turn this into an ENUM??
    groupNumber: { type: Number, require: true, unique: true, min: 1 },
    members: { type: [Schema.Types.ObjectId], ref: Users, default: null }
})

module.exports = model("Group", groupSchema);