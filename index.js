require('dotenv').config();
const { Sequelize, QueryTypes } = require('sequelize');
// import express from 'express';

// const app = express();

const sequelize = new Sequelize(process.env.ELEPHANT_URL);

const main = async () => {
  try {
    await sequelize.authenticate();
    console.log('connection to db has been established successfully');
    sequelize.close();
  } catch (err) {
    console.log('unable to connect to db', err);
  }
};

main();
