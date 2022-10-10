const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  name: { type: String, required: true },
  password: { type: String, minlength: 8 },
  files: [{ type: String }],
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 15);
  next();
});

userSchema.methods.isPasswordValid = async function (
  hashedPassword,
  candidatePassword
) {
  return await bcrypt.compare(candidatePassword, hashedPassword);
};

module.exports = mongoose.model("User", userSchema);
