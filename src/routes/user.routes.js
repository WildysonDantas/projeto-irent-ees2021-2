const router = require('express').Router();
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const auth = require('../middlewares/auth');
const UsersService = require('../controllers/user.services');
const User = require('../models/user.model');

const usersService = new UsersService(User);

router.get('/', auth, async (req, res) => {
  try {
    const users = await usersService.get();
    if (!users) return res.sendStatus(204);
    return res.json(users);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
});

router.get('/profile', auth, async (req, res) => {
  const { cookies } = req;
  if (!cookies?.jwt) return res.sendStatus(401);
  const refreshToken = cookies.jwt;
  const foundUser = await usersService.getByRefreshToken(refreshToken);
  if (!foundUser) return res.sendStatus(403);
  return jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if (err || foundUser._id.toString() !== decoded._id) return res.sendStatus(403);
      return res.json({ user: foundUser });
    },
  );
});

router.delete('/', auth, async (req, res) => {
  if (!req?.body?.id) return res.sendStatus(400);
  const user = await usersService.getById(req.body.id);
  if (!user) {
    return res.sendStatus(400);
  }
  try {
    await usersService.remove(req.body.id);
    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
});

// ==> Rota responsável por atualizar os dados do Usuário
router.put(
  '/',
  [
    auth,
    [
      body('email', 'Email inválido')
        .optional({ checkFalsy: false })
        .isEmail()
        .normalizeEmail(),
      body('name', 'Digite pelo menos 8 caracteres')
        .optional({ checkFalsy: false })
        .isLength({ min: 8 })
        .trim()
        .escape(),
    ],
  ],

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    if (!req?.body?.id) return res.sendStatus(400);
    const user = await usersService.getById(req.body.id);
    if (!user) return res.sendStatus(400);
    try {
      const { id, name, email } = req.body;
      const newUser = { name, email };
      await usersService.update(id, newUser);
      return res.sendStatus(200);
    } catch (error) {
      console.log(error);
      return res.sendStatus(400);
    }
  },
);

module.exports = router;
