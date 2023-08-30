const express = require('express');
const { PORT } = require('./util/config');
const { connectToDataBase } = require('./util/db');
const blogsRouter = require('./controllers/blog');

const app = express();

app.use(express.json());
app.use('/api/blogs', blogsRouter);

const start = async () => {
  await connectToDataBase();
  app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
  });
};

start();
