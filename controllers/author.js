const router = require('express').Router();
const { Blog } = require('../models');
const { sequelize } = require('../util/db');

router.get('/', async (req, res) => {
  const blogs = await Blog.findAll({
    attributes: [
      'author',
      [sequelize.fn('SUM', sequelize.col('likes')), 'likes'],
      [sequelize.fn('COUNT', sequelize.col('*')), 'blogs'],
    ],
    group: ['author'],
    order: [[sequelize.fn('SUM', sequelize.col('likes')), 'DESC']],
  });
  return res.json(blogs);
});

module.exports = router;
