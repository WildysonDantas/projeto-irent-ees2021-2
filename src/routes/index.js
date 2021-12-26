const express = require('express');
const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');

const router = express.Router();

router.get('/api/v1', (req, res) => {
  res.status(200).send({
    sucess: true,
    message: '🏡 iRent - Auth & Users',
    version: '1.0.0',
  });
});

router.use('/api/v1/auth', authRoutes);
router.use('/api/v1/users', userRoutes);

module.exports = router;
