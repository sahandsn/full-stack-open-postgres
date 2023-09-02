const router = require('express').Router();
const { Blog, User } = require('../models');

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

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization');
  if (authorization?.toLowerCase().startsWith('bearer ')) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET);
    } catch {
      return res.status(401).json({ error: 'token invalid' });
    }
  } else {
    return res.status(401).json({ error: 'token missing' });
  }
  next();
};

router.get('/', async (req, res) => {
  const blogs = await Blog.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name'],
    },
  });
  return res.json(blogs);
});

router.get('/:id', blogFinder, async (req, res) => {
  const blog = await Blog.findOne({
    where: {
      id: req.blog.id,
    },
  });
  return res.json(blog);
});

// add a new one
router.post('/', tokenExtractor, async (req, res, next) => {
  const user = await User.findByPk(req.decodedToken.id);
  Blog.create({ ...req.body, userId: user.id })
    .then((response) => {
      return res.json(response);
    })
    .catch((err) => {
      err.type = 'create';
      next(err);
    });
});

// delete one
router.delete('/:id', blogFinder, async (req, res, next) => {
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
