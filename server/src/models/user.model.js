const mongoose = require('mongoose');
const UserRoles = require('../constans/userRoles');

const UserSchema = new mongoose.Schema({
  email: { type: String, trim: true, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 8 },
  isConfirmed: { type: Boolean, default: false },
  role: { type: String, enum: Object.values(UserRoles), default: UserRoles.USER },
}, { timestamps: true });

const UserModel = mongoose.model('User', UserSchema);
module.exports = UserModel;
