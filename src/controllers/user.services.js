// const User = require('../models/user.model');

// eslint-disable-next-line no-unused-vars
class UsersService {
  constructor(User) {
    this.User = User;
  }

  get () {
    try {
      return this.User.find({}, '_id name email');
    } catch (error) {
      throw new Error(error);
    }
  }

  async getById (id) {
    try {
      return await this.User.findById(id, '_id name email');
    } catch (err) {
      throw new Error(err);
    }
  }

  async getByEmail (email) {
    try {
      return await this.User.findOne({ email }).exec();
    } catch (err) {
      throw new Error(err);
    }
  }

  async getByRefreshToken (refreshToken) {
    try {
      return await this.User.findOne({ refreshToken }).exec();
    } catch (err) {
      throw new Error(err);
    }
  }

  async getByCredentials (userDTO) {
    try {
      return await this.User.findByCredentials(userDTO.email, userDTO.password);
    } catch (err) {
      throw new Error(err);
    }
  }

  async create (userDTO) {
    try {
      const user = new this.User(userDTO);
      return await user.save();
    } catch (err) {
      throw new Error(err);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  async createAccessToken (userDTO) {
    try {
      return await userDTO.generateAuthToken();
    } catch (err) {
      throw new Error(err);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  async createRefreshToken (userDTO) {
    try {
      return await userDTO.generateRefreshToken();
    } catch (err) {
      throw new Error(err);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  async removeToken (userDTO) {
    try {
      const user = userDTO.refreshToken;
      user.token = '';
      user.refreshToken = '';
      return await user.save();
    } catch (err) {
      throw new Error(err);
    }
  }

  async update (id, userDTO) {
    try {
      await this.User.findOneAndUpdate({ _id: id }, userDTO);
    } catch (err) {
      throw new Error(err);
    }
  }

  async remove (id) {
    try {
      await this.User.deleteOne({ _id: id });
    } catch (err) {
      throw new Error(err);
    }
  }
}
module.exports = UsersService;
/*
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
}; */

/* // TODO: Implementar updateUser
  exports.updateUser = async (req, res) => {

  }; */
