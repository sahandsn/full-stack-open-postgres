const router = require('express').Router();
const { Blog } = require('../models');

const blogFinder = async (req, res, next) => {
  Blog.findByPk(req.params.id)
    .then((response) => {
      if (response === null) {
        err.type = 'find';
        next(err);
      }

      req.blog = response;
      next();
    })
    .catch((err) => {
      err.type = 'find';
      next(err);
    });
};

router.get('/', async (req, res) => {
  const blogs = await Blog.findAll();
  return res.json(blogs);
});

// add a new one
router.post('/', async (req, res, next) => {
  Blog.create(req.body)
    .then((response) => {
      return res.json(response);
    })
    .catch((err) => {
      err.type = 'create';
      next(err);
    });
});

// delete one
router.delete('/:id', blogFinder, async (req, res) => {
  req.blog
    .destroy()
    .then(() => {
      return res.status(200).json(req.blog);
    })
    .catch((err) => {
      err.type = 'delete';
      next(err);
    });
});

// update one
router.put('/:id', blogFinder, async (req, res, next) => {
  if (!Object.hasOwn(req.body, 'likes')) {
    next({ type: 'put' });
  }
  req.blog.likes = req.body.likes;
  req.blog
    .save()
    .then(() => {
      return res.status(200).json(req.blog);
    })
    .catch((err) => {
      err.type = 'put';
      next(err);
    });
});

module.exports = router;
