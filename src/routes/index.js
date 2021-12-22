const express = require('express');
const userRoutes = require('./user.routes');

const router = express.Router();

router.get('/api/v1', (req, res) => {
  res.status(200).send({
    sucess: true,
    message: 'Seja bem-vindo(a) a API Node.js + MongoDB + Azure!',
    version: '1.0.0',
  });
});

router.use('/api/v1/users', userRoutes);

module.exports = router;
