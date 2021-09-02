const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const { Schema } = mongoose;

const Product = new Schema({
  product: {
    type: String,
    trim: true,
  },
  name: {
    type: String,
    trim: true,
  },
  discription: {
    type: String,
    trim: true,
  },
  code: {
    type: String,
    trim: true,
  },
  color: {
    type: String,
    trim: true,
  },
});

mongoose.model("product", Product);
module.exports = mongoose.model("product");
