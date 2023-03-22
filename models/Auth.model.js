const { model, Schema, mongoose } = require('mongoose');

const authSchema = new Schema({
    userId: { type: mongoose.ObjectId, require: true },
    password: { type: String, require: true },
    confirm: { type: Boolean, require: true },
    token: { type: String, require: true }
});

module.exports = model('Auth', authSchema);