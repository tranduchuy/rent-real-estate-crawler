const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  email: String,
  hash_password: String,
  confirmToken: String,
  phone: String,
  name: String,
  birthday: Number,
  gender: Number,
  city: String,
  avatar: String,
  district: Number,
  ward: Number,
  type: Number,
  role: { type: Number, default: 1 },
  status: { type: Number, default: 1 },
  date: { type: Number, default: Date.now },
  resetPasswordToken: String
});

const UserModel = mongoose.model('User', userSchema);

module.exports = class UserModel {
  constructor(logger) {
    this.logger = logger;
    this.UserModel = UserModel;
    this.demo = this.demo.bind(this);
  }

  demo() {
    console.log(this.UserModel);
  }
}