const bcrypt = require('bcryptjs');

// eslint-disable-next-line no-unused-vars
class UsersService {
  constructor(User) {
    this.User = User;
  }

  get () {
    try {
      return this.User.find({}, '_id name email createdAt updatedAt');
    } catch (error) {
      return new Error(error);
    }
  }

  async getById (id) {
    try {
      return await this.User.findById(id, '_id name email isAdmin');
    } catch (err) {
      return new Error(err);
    }
  }

  async getByEmail (email) {
    try {
      return await this.User.findOne({ email }).exec();
    } catch (err) {
      return new Error(err);
    }
  }

  async getByRefreshToken (refreshToken) {
    try {
      return await this.User
        .findOne({ refreshToken })
        .select('-password -__v -token -refreshToken -resetToken -isAdmin ')
        .exec();
    } catch (err) {
      return new Error(err);
    }
  }

  async getByToken (token) {
    try {
      return await this.User
        .findOne({ token })
        .select('-password -__v -token -refreshToken ')
        .exec();
    } catch (err) {
      return new Error(err);
    }
  }

  async getByResetToken (resetToken) {
    try {
      return await this.User
        .findOne({ resetToken })
        .select('-password -__v -token -refreshToken ')
        .exec();
    } catch (err) {
      return new Error(err);
    }
  }

  async getByCredentials (userDTO) {
    try {
      return await this.User.findByCredentials(userDTO.email, userDTO.password);
    } catch (err) {
      return new Error(err);
    }
  }

  async isAdmin (id) {
    try {
      const user = await this.User.findById(id);
      return user.isAdmin ? true : false;
    } catch (err) {
      return new Error(err);
    }
  }

  async create (userDTO) {
    try {
      const user = new this.User(userDTO);
      return await user.save();
    } catch (err) {
      return new Error(err);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  async createAccessToken (userDTO) {
    try {
      return await userDTO.generateAuthToken();
    } catch (err) {
      return new Error(err);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  async createRefreshToken (userDTO) {
    try {
      return await userDTO.generateRefreshToken();
    } catch (err) {
      return new Error(err);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  async createResetToken (userDTO) {
    try {
      return await userDTO.generateResetToken();
    } catch (err) {
      return new Error(err);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  async removeToken (userDTO) {
    try {
      const user = userDTO;
      user.token = '';
      user.refreshToken = '';
      return await user.save();
    } catch (err) {
      return new Error(err);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  async removeResetToken (userDTO) {
    try {
      const user = userDTO;
      user.resetToken = '';
      return await user.save();
    } catch (err) {
      return new Error(err);
    }
  }

  async update (id, userDTO) {
    try {
      if (userDTO?.password) {
        const user = userDTO;
        user.password = await bcrypt.hash(user.password, 10);
        return await this.User.findOneAndUpdate({ _id: id }, user);
      }
      return await this.User.findOneAndUpdate({ _id: id }, userDTO);
    } catch (err) {
      return new Error(err);
    }
  }

  async remove (id) {
    try {
      await this.User.deleteOne({ _id: id });
    } catch (err) {
      return new Error(err);
    }
  }
}

module.exports = UsersService;
