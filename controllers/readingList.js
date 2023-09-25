const router = require('express').Router();
const { UsersBlogs } = require('../models');

router.post('/', async (req, res, next) => {
  const { blogId, userId } = req.body;
  if (!(blogId && userId)) {
    return next({ type: 'addReadingist' });
  }
  UsersBlogs.create({ blogId, userId })
    .then((response) => {
      return res.status(201).json(response);
    })
    .catch((err) => {
      err.type = 'addReadingist';
      next(err);
    });
});

module.exports = router;
