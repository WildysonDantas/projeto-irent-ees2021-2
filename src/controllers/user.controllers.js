const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

// ==> Médoto responsável por crirar usuário
exports.registerNewUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const isUser = await User.findOne({ email: req.body.email }).exec();
    if (isUser) {
      return res.sendStatus(409);
    }
    const newUser = new User(req.body);
    let user = await newUser.save();
    user = await user.generateAuthToken();
    user = await user.generateRefreshToken();
    res.cookie('jwt', user.refreshToken, { httpOnly: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 }); // secure: true,
    return res.status(201).json({ token: user.token });
  } catch (err) {
    console.log(err);
    return res.sendStatus(401);
  }
};

exports.refreshToken = async (req, res) => {
  const { cookies } = req;
  if (!cookies?.jwt) return res.sendStatus(401);
  const refreshToken = cookies.jwt;
  let foundUser = await User.findOne({ refreshToken }).exec();
  if (!foundUser) return res.sendStatus(403); // Forbidden
  return jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      // eslint-disable-next-line no-underscore-dangle
      if (err || foundUser._id.toString() !== decoded._id) return res.sendStatus(403);
      foundUser = await foundUser.generateAuthToken();
      return res.json({ token: foundUser.token });
    },
  );
};

exports.loginUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { email, password } = req.body;
    const user = await User.findByCredentials(email, password);
    if (!user) {
      return res.sendStatus(401);
    }
    let userLoged = await user.generateAuthToken();
    userLoged = await user.generateRefreshToken();
    // console.log(userLoged);
    res.cookie('jwt', userLoged.refreshToken, { httpOnly: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 }); // secure: true,
    return res.status(200).json({ token: userLoged.token });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error });
  }
};

exports.allUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password -token -refreshToken -__v').exec();
    if (!users) return res.sendStatus(204);
    return res.json(users);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

exports.userProfile = async (req, res) => {
  try {
    return res.json(req.userData);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

exports.deleteUser = async (req, res) => {
  if (!req?.body?.id) return res.sendStatus(400);
  const user = await User.findOne({ _id: req.body.id }).exec();
  if (!user) {
    return res.sendStatus(400);
  }
  try {
    await user.deleteOne({ _id: req.body.id });
    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

/* // TODO: Implementar updateUser
  exports.updateUser = async (req, res) => {

  }; */
