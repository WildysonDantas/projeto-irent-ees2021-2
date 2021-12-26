const router = require('express').Router();
const auth = require('../middlewares/auth');
const UsersService = require('../controllers/user.services');
const User = require('../models/user.model');

const usersService = new UsersService(User);

router.get('/', auth, async (req, res) => {
  try {
    const users = usersService.get();
    if (!users) return res.sendStatus(204);
    return res.json(users);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
});

// router.get('/profile', auth, userController.userProfile);

// router.delete('/users', auth, userController.deleteUser);

// router.put('/users', auth, userController.updateUser);

module.exports = router;
