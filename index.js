const express = require('express');
const { PORT } = require('./util/config');
const { connectToDataBase } = require('./util/db');
const blogsRouter = require('./controllers/blog');
const usersRouter = require('./controllers/user');
const loginRouter = require('./controllers/login');

const app = express();

app.use(express.json());
app.use('/api/blogs', blogsRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);
app.use((req, res) => {
  res.status(404).json({ error: 'unknown endpoint' });
});
app.use((error, req, res, next) => {
  console.error('error handling middleware', error);
  switch (error.type) {
    case 'create':
      return res.status(400).json({ error: 'blog was not created' });
    case 'find':
      return res.status(404).json({ error: 'blog was not found' });
    case 'delete':
      return res.status(400).json({ error: 'blog was not deleted' });
    case 'put':
      return res.status(400).json({ error: 'blog was not updated' });
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
