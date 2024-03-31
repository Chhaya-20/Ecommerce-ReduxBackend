const jwt = require("jsonwebtoken");
const User = require("../model/User");

exports.fetchUser = async (req, res, next) => {
  const token = req.headers.authorization; 
  // console.log("here", token);
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized: No token provided" });
  }

  const tokenParts = token.split(" ");
  if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized: Invalid token format" });
  }

  const tokenValue = tokenParts[1];

  jwt.verify(tokenValue, "Chhaya@10", async (err, decodedToken) => {
    if (err) {
      // Token is invalid or expired
      return res.status(401).json({ success: false, message: "Unauthorized" });
    } else {
      const userId = decodedToken.userId;
      // Now you can use the userId to perform operations, such as fetching user data from the database
      // Example:
      const user = await User.findById(userId);
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      } else {
        // User found, do something with it
        req.user = user; // Attach the user object to the request for further use
        next(); // Call next middleware function
      }
    }
  });
};
