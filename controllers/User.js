const User = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.LoginUser = async (req, res) => {
  console.log("hetre");
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Compare the password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res
        .status(404)
        .json({ success: false, message: "Incorrect password" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, "Chhaya@10", {
      expiresIn: "1d",
    });

    // Set the token to the header
    res.setHeader("Authorization", `Bearer ${token}`);

    return res
      .status(200)
      .json({ success: true, message: "Login successful", token });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

exports.SignupUser = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please fill all the details carefully",
    });
  }
  try {
    const result = await User.findOne({ email });
    if (result != null) {
      return res
        .status(500)
        .json({ success: false, message: "Already User Exist" });
    }
    const saltRounds = 10;
    bcrypt.hash(password, saltRounds, async (err, hash) => {
      if (err) {
        console.error("Error hashing password:", err);
        return res.status(500).send("Internal Server error");
      }
      try {
        // console.log("Hashed password:", hash);
        const user = new User({ name, email, password: hash });
        await user.save();
        const token = jwt.sign({ userId: user._id }, "Chhaya@10", {
          expiresIn: "1d",
        });

        // Set the token to the header
        res.setHeader("Authorization", `Bearer ${token}`);

        return res
          .status(200)
          .json({ success: true, message: "Login successful", token });
      } catch (err) {
        console.error("Error saving user:", err);
        return res.status(500).send("Internal Server error");
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal Server error");
  }
};

exports.Forget = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please fill all the details carefully",
    });
  }
  try {
    const result = await User.findOne({ email });
    if (result == null) {
      return res
        .status(500)
        .json({ success: false, message: "User do not Exist" });
    }
    const saltRounds = 10;
    bcrypt.hash(password, saltRounds, async (err, hash) => {
      if (err) {
        console.error("Error hashing password:", err);
        return res.status(500).send("Internal Server error");
      }
      try {
        result.password = hash;
        await result.save();
        return res
          .status(200)
          .json({ success: true, message: "Password Reset Successfully " });
      } catch (err) {
        console.error("Error saving user:", err);
        return res.status(500).send("Internal Server error");
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal Server error");
  }
};
