const mongoose = require("mongoose");

require("dotenv").config();

const connection = mongoose.connect("mongodb+srv://Raj:Raj@cluster0.egewdp3.mongodb.net/ruralsnails?retryWrites=true&w=majority");

module.exports={connection}

