
const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = () => {
  return mongoose.connect(process.env.mongoDbURL);
};

module.exports = { connectDB };