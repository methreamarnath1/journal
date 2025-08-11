const jwt = require("jsonwebtoken");
const User = require("../models/user.js");

exports.register = async (req, res) => {
  // the exports is used to register the user
  try {
    const { name, email, password } = req.body; // this will get the name, email and password from the request body
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const newUser = new User({
      name,
      email,
      password,
    });
    await newUser.save(); // this will save the user in the database
    //gernrate JWT Token
    const token = jwt.sign(
      {
        id: newUser._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    const { password: _, ...userData } = newUser.toObject();
    res.status(201).json({ token, user: userData });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
//login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body; // this will get the email and password from the request body
    //find
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }
    //check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    const { password: _, ...userData } = user.toObject();
    res.status(200).json({ token, user: userData });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
