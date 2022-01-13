const router = require('express').Router();
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const auth = require('../middlewares/auth');
const UsersService = require('../controllers/user.services');
const User = require('../models/user.model');

const usersService = new UsersService(User);

async function userIsAdmin (req, res) {
  // verifica se o usuário logado tem acesso
  const { _id } = jwt.decode(req.cookies.jwt);
  if (!_id) return res.sendStatus(403);

  const user = await usersService.getById(_id);
  return user.isAdmin ? true : false;
}

router.get('/', auth, async (req, res) => {
  try {

    if (!userIsAdmin(req, res)) return res.sendStatus(403);

    const users = await usersService.get();
    if (!users) return res.sendStatus(204);
    return res.json(users);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
});

// TODO: Corrigir a rota 
router.get('/user', auth, async (req, res) => {
  const { cookies } = req;
  if (!cookies?.jwt) return res.sendStatus(401);
  const refreshToken = cookies.jwt;
  const foundUser = await usersService.getByRefreshToken(refreshToken);
  if (!foundUser) return res.sendStatus(403);
  return res.json(foundUser)
});

router.delete('/', auth, async (req, res) => {
  if (!userIsAdmin(req, res)) return res.sendStatus(403);
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

    const { _id } = jwt.decode(req.cookies.jwt);
    if (!_id) return res.sendStatus(403);

    const logedUser = await usersService.getById(_id);

    if (!(logedUser._id === user._id || logedUser.isAdmin)) return res.sendStatus(403)

    try {
      const { id, name, email } = req.body;
      const updatedUser = { name, email };
      await usersService.update(id, updatedUser);
      return res.sendStatus(200);
    } catch (error) {
      console.log(error);
      return res.sendStatus(400);
    }
  },
);

module.exports = router;
