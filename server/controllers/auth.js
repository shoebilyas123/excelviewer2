const { signToken, verify } = require("../utils/auth");
const User = require("./../models/user");

exports.register = async (req, res) => {
  try {
    const { email, name, password } = req.body;

    if (!email || !name || !password)
      return res
        .status(400)
        .json({ message: "Email, name and password must be provided" });

    const payload = { email, password, name };

    const newUser = await User.create(payload);
    const accessToken = signToken(newUser._id);

    console.log(newUser, accessToken);

    res.status(201).json({
      name: newUser.name,
      email: newUser.email,
      accessToken,
      id: newUser._id,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res
        .status(400)
        .json({ message: "Email and password are required" });

    const user = await User.findOne({ email });

    if (!user)
      return res
        .status(404)
        .json({ message: "User is either deleted or does not exist" });

    if (!(await user.isPasswordValid(user.password, password))) {
      return res.status(401).json({ message: "Password invalid" });
    }

    console.log({ user });
    const accessToken = signToken(user._id);

    res.status(201).json({
      name: user.name,
      email: user.email,
      accessToken,
      id: user._id,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
