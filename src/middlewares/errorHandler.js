const { logEvents } = require('./logEvents');

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  logEvents(`${err.name}: ${err.message}`, 'errLog.txt');
  console.error(err.stack);
  res.status(500).send(err.message);
};

module.exports = errorHandler;
