const router = require('express').Router();
const { Blog } = require('../models');

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id);
  next();
};

router.get('/', async (req, res) => {
  const blogs = await Blog.findAll();
  return res.json(blogs);
});

// add a new one
router.post('/', async (req, res) => {
  try {
    const blog = await Blog.create(req.body);
    return res.json(blog);
  } catch (err) {
    return res.status(400).json({ err });
  }
});

// delete one
router.delete('/:id', blogFinder, async (req, res) => {
  try {
    if (req.blog) {
      req.blog.destroy();
      return res.status(200).json(req.blog);
    }
    return res.status(404).end();
  } catch (err) {
    return res.status(400).json({ err });
  }
});

module.exports = router;
