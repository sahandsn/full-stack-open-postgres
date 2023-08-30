require('dotenv').config();

module.exports = {
  DATABASE_URL: process.env.ELEPHANT_URL,
  PORT: process.env.PORT,
};
