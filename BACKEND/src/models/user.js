const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { type } = require("os");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});
userSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    next();
  } catch (error) {
    return next(error);
  }
});
userSchema.methods.comparePassword = async function (password) {
  // if the password is true then the authentication will be successful
  return await bcrypt.compare(password, this.password); // this is used to compare the password with the hashed password, if the entered password is same as the hashed password, it will return true
};

const User = mongoose.model("User", userSchema);
module.exports = User;
