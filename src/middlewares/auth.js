const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    const token = authHeader.split(' ')[1];
    const foundUser = await User.findOne({ token }).exec();
    if (!foundUser) return res.sendStatus(403); // Forbidden
    return jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET,
      async (err, decoded) => {
        if (err || foundUser._id.toString() !== decoded._id) return res.sendStatus(403);
        req.userData = decoded;
        return next();
      },
    );
  } catch (error) {
    console.log(error);
    return res.sendStatus(401);
  }
};
