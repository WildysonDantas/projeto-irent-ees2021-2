const router = require('express').Router();
const jwt = require('jsonwebtoken');
const { check, validationResult, cookie } = require('express-validator');
const UsersService = require('../controllers/user.services');
const User = require('../models/user.model');
const { sendMail } = require('../controllers/email.service');

const usersService = new UsersService(User);

router.post(
  '/register',
  [
    check('email', 'Email inválido').isEmail(),
    check('name', 'Digite pelo menos 5 caracteres').isLength({ min: 5 }),
    check('confirmPassword', 'Digite pelo menos 5 caracteres').isLength({ min: 5 }),
    check(
      'password',
      'Digite pelo menos 5 caracteres',
    )
      .isLength({ min: 5 })
      .custom(
        (value, { req }) => {
          if (value !== req.body.confirmPassword) {
            throw new Error('As senhas devem ser iguais');
          } else {
            return value;
          }
        },
      ),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // verifica se ohá um usuário logado
    const { cookies } = req;
    if (cookies?.jwt) return res.sendStatus(302);
    try {
      const { email, name, password } = req.body;
      const isUser = await usersService.getByEmail(email);
      if (isUser) {
        return res.sendStatus(409);
      }
      await usersService.create({ email, name, password });
      return res.sendStatus(201);
    } catch (err) {
      console.log(err);
      return res.sendStatus(401);
    }
  },
);

router.post(
  '/login',
  [
    check('email', 'Email inválido').isEmail(),
    check('password', 'Digite pelo menos 8 caracteres').isLength({ min: 8 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { email, password } = req.body;
      const user = await usersService.getByCredentials({ email, password });
      if (!user) {
        return res.sendStatus(401);
      }
      let userLoged = await usersService.createAccessToken(user);
      userLoged = await usersService.createRefreshToken(user);
      res.cookie(
        'jwt',
        userLoged.refreshToken,
        { httpOnly: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 },
      ); // secure: true,
      return res.status(200).json({ token: userLoged.token });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ error });
    }
  },
);

router.post(
  '/refresh',
  [
    cookie('jwt', 'Código inválido').isJWT(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { cookies } = req;
    if (!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;
    let foundUser = await usersService.getByRefreshToken(refreshToken);
    if (!foundUser) return res.sendStatus(403); // Forbidden
    return jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        if (err || foundUser._id.toString() !== decoded._id) return res.sendStatus(403);
        foundUser = await usersService.createAccessToken(foundUser);
        return res.json({ token: foundUser.token });
      },
    );
  },
);

router.get('/logout', async (req, res) => {
  const { cookies } = req;
  if (!cookies?.jwt) return res.sendStatus(204); // No content
  const refreshToken = cookies.jwt;
  const foundUser = await usersService.getByRefreshToken(refreshToken);
  if (!foundUser) {
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
    return res.sendStatus(204);
  }
  res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
  await usersService.removeToken(foundUser);
  return res.sendStatus(200);
});

router.post(
  '/forgotpassword/',
  [
    check('email', 'Email inválido').isEmail(),
  ],

  async (req, res) => {
    // Verifica se tem erro no body.email
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // verifica se ohá um usuário logado
    const { cookies } = req;
    if (cookies?.jwt) return res.sendStatus(302);

    // localiza algum usuário com o email cadastrado
    let foundUser = await usersService.getByEmail(req.body.email);
    if (!foundUser) {
      console.log('trouxa');
      return res.sendStatus(200);
    }

    // Envia o email com o token de recuperação
    try {
      foundUser = await usersService.createResetToken(foundUser);

      // link do frontend para reset de senha
      const link = `http://localhost:3000/api/v1/auth/reset/${foundUser.resetToken.toString()}`;
      const html = `<h3>Olá ${foundUser.name.toString()}!</h3><br><br>Para alterar a senha de acesso ao nosso sistema clique <a href="${link}">aqui</a>. <br><br>Caso não consiga, copie e cole o link abaixo no seu navegador:<br>${link}<br><br>Caso não reconheça esse pedido de alteração não nos deixe de informar.<br><br>Equipe iRent IFPI 2021 🏡`;
      const mailOptions = {
        from: 'IRENT IFPI 2021 🏡 <irent.ifpi.2021@gmail.com>',
        to: foundUser.email.toString(),
        subject: 'Recuperação de senha - iRent IFPI',
        text: 'Link de recuperação',
        html,
      };
      sendMail(mailOptions)
        .then((result) => console.log('Email enviado...', result))
        .catch((error) => console.log(error.message));
      return res.sendStatus(200);
    } catch (error) {
      console.log(error);
      return res.sendStatus(200);
    }
  },
);

router.post(
  '/resetpassword/',
  [
    check('token', 'Código inválido').isJWT(),
    check(
      'password',
      'Digite pelo menos 8 caracteres',
    )
      .isLength({ min: 8 })
      .custom(
        (value, { req }) => {
          if (value !== req.body.confirmPassword) {
            throw new Error('As senhas devem ser iguais');
          } else {
            return value;
          }
        },
      ),
  ],
  async (req, res) => {
    // Verifica se tem erro no body.email
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // verifica se ohá um usuário logado
    const { cookies } = req;
    if (cookies?.jwt) return res.sendStatus(302);

    try {
      const { token, password } = req.body;
      // verifica se há um resetToken gravado no banco de dados
      let foundUser = await usersService.getByResetToken(token);

      if (!foundUser) return res.sendStatus(403);
      return jwt.verify(
        token,
        process.env.RESET_TOKEN_SECRET,
        async (err, decoded) => {
          if (err || foundUser.email.toString() !== decoded.email) return res.sendStatus(403);
          foundUser = usersService.update(foundUser._id.toString(), { password });
          foundUser = usersService.removeResetToken(foundUser);
          return res.sendStatus(200);
        },
      );
    } catch (error) {
      console.log(error);
      return res.sendStatus(400);
    }
  },
);

module.exports = router;
