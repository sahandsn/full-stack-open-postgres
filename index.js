require('dotenv').config();
const { Sequelize, Model, DataTypes } = require('sequelize');
const express = require('express');

const app = express();

app.use(express.json());

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

// const main = async () => {
//   try {
//     await sequelize.authenticate();
//     console.log('connection to db has been established successfully');
//     const blogs = await Blog.findAll();
//     blogs.forEach(b => {
//         console.log(`${b.dataValues.author}: ${b.dataValues.title}, ${b.dataValues.likes} likes`);
//     })
//     sequelize.close();
//   } catch (err) {
//     console.log('unable to connect to db', err);
//   }
// };

// main();

// get all
app.get('/api/blogs', async (req, res) => {
  const blogs = await Blog.findAll();
  return res.json(blogs);
});

// add a new one
app.post('/api/blogs', async (req, res) => {
  try {
    const blog = await Blog.create(req.body);
    return res.json(blog);
  } catch (err) {
    return res.status(400).json({ err });
  }
});

// delete one
app.delete('/api/blogs/:id', async (req, res) => {
  try {
    const blog = await Blog.findByPk(req.params.id);
    if (blog) {
      blog.destroy();
      return res.status(200).json(blog);
    }
    return res.status(404).end();
  } catch (err) {
    return res.status(400).json({ err });
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log('server running on port', PORT);
});
