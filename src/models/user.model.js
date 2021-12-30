const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { Schema } = mongoose;

const userSchema = new Schema({
  name: { type: String, maxlength: 50, required: true },
  email: { type: String, maxlength: 30, required: true },
  password: { type: String, required: true },
  token: { type: String },
  refreshToken: { type: String },
  resetToken: { type: String },
  /* tokens: [
    { token: { type: String } },
    { refreshToken: { type: String } },
  ], */
}, {
  timestamps: true,
  collection: 'users',
});

// ==>
userSchema.pre('save', {
  document: true,
  query: false,
  // eslint-disable-next-line func-names
}, async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 10);
  }
  next();
});

// ==>
// eslint-disable-next-line
userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '3m' },
  );
  user.token = token;
  await user.save();
  return user;
};

// eslint-disable-next-line
userSchema.methods.generateRefreshToken = async function () {
  const user = this;
  const refreshToken = jwt.sign(
    { _id: user._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '1d' },
  );
  user.refreshToken = refreshToken;
  await user.save();
  return user;
};

userSchema.methods.generateResetToken = async function () {
  const user = this;
  const resetToken = jwt.sign(
    { _id: user._id },
    process.env.RESET_TOKEN_SECRET,
    { expiresIn: '2d' },
  );
  user.resetToken = resetToken;
  await user.save();
  return user;
};

userSchema.statics.findByCredentials = async (email, password) => {
  // eslint-disable-next-line no-use-before-define
  const user = await User.findOne({ email });
  if (!user) {
    return null;
  }
  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    return null;
  }
  return user;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
