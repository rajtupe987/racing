const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = () => {
  return mongoose.connect(process.env.mongoDbURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });
};

module.exports = { connectDB };