const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const { Schema } = mongoose;

const User = new Schema({
  name: {
    type: String,
    trim: true,
  },
  fname: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
  },
  // age: {
  //   type: String,
  // },
  product: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
    },
  ],
  password: {
    type: String,
    trim: true,
  },
});

User.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

mongoose.model("user", User);
module.exports = mongoose.model("user");
