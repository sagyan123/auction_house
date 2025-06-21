const mongoose = require("mongoose");

const database = async () => {
  try {
    const res = await mongoose.connect(process.env.DATABASE_URL);
    console.log("Connection with MongoDB established");
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
};

module.exports = database;
