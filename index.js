require('dotenv').config();
// const { Sequelize, QueryTypes } = require('sequelize');
// const express = require('express');

// const app = express();

// const sequelize = new Sequelize(process.env.ELEPHANT_URL);

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

// app.get('/api/notes', async (req, res) => {
//   const notes = await sequelize.query('SELECT * FROM blogs', {
//     type: QueryTypes.SELECT,
//   });
//   res.json(notes);
// });

// const PORT = process.env.PORT || 3001;

// app.listen(PORT, () => {
//   console.log('server running on port', PORT);
// });
