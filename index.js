require('dotenv').config();
const { Sequelize, QueryTypes, Model, DataTypes } = require('sequelize');
// const express = require('express');

// const app = express();

const sequelize = new Sequelize(process.env.ELEPHANT_URL);

class Blog extends Model {}
Blog.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    author: {
      type: DataTypes.STRING(255),
    },
    url: {
      type: DataTypes.STRING(2048),
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'blog',
  }
);

const main = async () => {
  try {
    await sequelize.authenticate();
    console.log('connection to db has been established successfully');
    const blogs = await Blog.findAll();
    blogs.forEach(b => {
        console.log(`${b.dataValues.author}: ${b.dataValues.title}, ${b.dataValues.likes} likes`);
    })
    sequelize.close();
  } catch (err) {
    console.log('unable to connect to db', err);
  }
};

main();

// app.get('/api/blogs', async (req, res) => {
//   const blogs = await sequelize.query('SELECT * FROM blogs', {
//     type: QueryTypes.SELECT,
//   });
//   res.json(blogs);
// });

// const PORT = process.env.PORT || 3001;

// app.listen(PORT, () => {
//   console.log('server running on port', PORT);
// });
