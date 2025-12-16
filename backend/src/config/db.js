const mongoose = require("mongoose");

async function connectDB(mongoUri) {
  await mongoose.connect(mongoUri);
  // eslint-disable-next-line no-console
  console.log("MongoDB connected");
}

module.exports = {
  connectDB,
};


