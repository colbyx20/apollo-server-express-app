const { model, Schema, mongoose } = require('mongoose');

const authSchema = new Schema({
    userId: { type: mongoose.ObjectId, require: true },
    password: { type: String, require: true },
    confirm: { type: Boolean, require: true },
    token: { type: String, require: true },
    privilege: { type: String, require: true },
    isReset: { type: Boolean, default: false },
});

module.exports = model('Auth', authSchema);