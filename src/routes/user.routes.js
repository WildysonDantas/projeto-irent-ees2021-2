const router = require('express').Router();
const { check } = require('express-validator');
const auth = require('../middlewares/auth');
const userController = require('../controllers/user.controllers');

// ==> Rota responsável por criar um novo 'User': (POST) localhost:3000/api/v1/register
router.post('/register', [check('email', 'Email inválido').isEmail()], userController.registerNewUser);

/*
  ==> Rota responsável por gerar o token e o refreshToken de 'User':
  (POST) localhost:3000/api/v1/login
 */
router.post('/login', [check('email', 'Email inválido').isEmail()], userController.loginUser);

// ==> Rota responsável por gerar um novo token de 'User': (POST) localhost:3000/api/v1/refresh
router.post('/refresh', userController.refreshToken);

router.get('/userProfile', auth, userController.userProfile);

router.get('/', auth, userController.allUsers);
router.delete('/users', auth, userController.deleteUser);
// router.put('/users', auth, userController.updateUser);

module.exports = router;
