const express = require('express');
//const authRoutes = require('./auth.routes');
//const userRoutes = require('./user.routes');
const rentRoutes = require('./rent.routes');

const router = express.Router();
router.use('/api/v1/rent/', rentRoutes);
router.get('/api/v1/rent/home', (req, res) => {
  res.status(200).send({
    success: true,
    message: 'iRent - RENTS HOUSES',
    version: '1.0.0',
  });
});

//router.use('/api/v1/auth', authRoutes);
//router.use('/api/v1/users', userRoutes);

module.exports = router;
