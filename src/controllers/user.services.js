// const User = require('../models/user.model');

// eslint-disable-next-line no-unused-vars
class UsersService {
  constructor(User) {
    this.User = User;
  }

  get () {
    try {
      return this.User.find({}, '_id name email createdAt updatedAt');
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
      return await this.User
        .findOne({ refreshToken })
        .select('-password -__v -token -refreshToken ')
        .exec();
    } catch (err) {
      throw new Error(err);
    }
  }

  async getByToken (token) {
    try {
      return await this.User
        .findOne({ token })
        .select('-password -__v -token -refreshToken ')
        .exec();
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
