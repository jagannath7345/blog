const { Schema, model } = require("mongoose");
const { createHmac, randomBytes } = require("crypto");
const { createToken } = require("../service/auth");

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    salt: { type: String },
    password: { type: String, required: true },
    profileImage: { type: String, default: "/images/profile.png" },
    role: { type: String, enum: ["USER", "ADMIN"], default: "USER" },
  },
  { timeseries: true }
);

userSchema.pre("save", function (next) {
  const user = this;
  if (!user.isModified("password")) return;

  const salt = randomBytes(11).toString();
  const hashPassword = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");

  this.salt = salt;
  this.password = hashPassword;
  next();
});

userSchema.static("matchPassword", async function (email, password) {
  const user = await this.findOne({ email });
  if (!user) throw new Error("User not Found");
  const salt = user.salt;
  const hashPassword = user.password;
  const userProvidedPassword = createHmac("sha256", salt)
    .update(password)
    .digest("hex");

  if (hashPassword !== userProvidedPassword)
    throw new Error("Incorrect password");
 
    const token = createToken(user);
    return token;
});

const User = model("user", userSchema);
module.exports = User;
