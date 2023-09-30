const express = require('express');
const { PORT } = require('./util/config');
const { connectToDataBase } = require('./util/db');
const blogsRouter = require('./controllers/blog');
const usersRouter = require('./controllers/user');
const loginRouter = require('./controllers/login');
const logoutRouter = require('./controllers/logout');
const authorRouter = require('./controllers/author');
const readingListRouter = require('./controllers/readingList');

const app = express();

app.use(express.json());
app.use('/api/blogs', blogsRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);
app.use('/api/logout', logoutRouter);
app.use('/api/author', authorRouter);
app.use('/api/readinglists', readingListRouter);
app.use((req, res) => {
  res.status(404).json({ error: 'unknown endpoint' });
});
app.use((error, req, res, next) => {
  console.error('error handling middleware', error);
  if (error.name === 'SequelizeValidationError') {
    return res
      .status(401)
      .json({ error: error.errors[0].message ?? 'something went wrong.' });
  }
  switch (error.type) {
    case 'create':
      return res.status(400).json({ error: 'blog was not created' });
    case 'find':
      return res.status(404).json({ error: 'blog was not found' });
    case 'delete':
      return res.status(400).json({ error: 'blog was not deleted' });
    case 'put':
      return res.status(400).json({ error: 'blog was not updated' });
    case 'addReadingist':
      return res.status(400).json({ error: 'blogId and userId are needed' });
    case 'putReadinglistNotFound':
      return res.status(400).json({ error: 'reading list id is not found' });
    case 'putReadinglistRead':
      return res.status(400).json({ error: 'read value is needed' });
    default:
      return res.status(500).json({ error: 'an error occured' });
  }
});

const start = async () => {
  await connectToDataBase();
  app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
  });
};

start();
