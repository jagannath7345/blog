const jwt = require("jsonwebtoken");
const secret = "user@auth7345";

function createToken(user) {
  const payload = {
    _id: user._id,
    name:user.name,
    email: user.email,
    profileImage: user.profileImage,
    role: user.role,
  };
  const token = jwt.sign(payload, secret);
  return token;
}

function validToken(token) {
  const payload = jwt.verify(token, secret);
  return payload;
}

module.exports = { createToken, validToken };
