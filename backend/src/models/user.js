const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  isVerified: { type: Boolean, default: false },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  twoFactorEnabled: { type: Boolean, default: false },
  twoFactorSecret: String,
});

module.exports = mongoose.model("User", UserSchema);