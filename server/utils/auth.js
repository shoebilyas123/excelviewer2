const User = require("../models/user");
const { verify, sign } = require("jsonwebtoken");

exports.protect = async (req, res, next) => {
  let token = null;

  if (
    req.headers["authorization"] &&
    req.headers["authorization"].split(" ")[0] === "Bearer"
  ) {
    token = req.headers["authorization"].split(" ")[1];

    const { id, iat, exp } = this.verify(token);

    if (Date.now() - iat * 1000 > exp) {
      res.status(401).json({
        message: "Your session has expired. Please log in again.",
      });
      return;
    }

    const user = await User.findById(id);
    if (!user) {
      res.status(401).json({
        message: "User has either been deleted or does not exist",
      });
      return;
    }

    req.user = user;
    next();
  } else {
    res.status(401).json({ message: "Not authorized" });
  }
};

exports.signToken = (id) =>
  sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

exports.verify = (token) => verify(token, process.env.JWT_SECRET);
