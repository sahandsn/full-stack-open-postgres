const router = require('express').Router();
const { Blog, User } = require('../models');
const { Op } = require('sequelize');
const {blogFinder, tokenExtractor} = require('../util/router')

router.get('/', async (req, res) => {
  let where = {};
  if (req.query.search) {
    const searchTitleAndAuthor = {
      [Op.or]: [
        {
          title: {
            [Op.iLike]: `%${req.query.search}%`,
          },
        },
        {
          author: {
            [Op.iLike]: `%${req.query.search}%`,
          },
        },
      ],
    };
    where = { ...where, ...searchTitleAndAuthor };
    console.log(where);
  }

  const blogs = await Blog.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name'],
    },
    where,
    order: [['likes', 'DESC']],
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
router.delete('/:id', tokenExtractor, blogFinder, async (req, res, next) => {
  const user = await User.findByPk(req.decodedToken.id);
  console.log('user', user);
  console.log('blog', req.blog);
  if (user && user.username === req.blog.user.username) {
    req.blog
      .destroy()
      .then(() => {
        return res.status(200).json(req.blog);
      })
      .catch((err) => {
        err.type = 'delete';
        next(err);
      });
  } else {
    return res.status(401).json({ error: 'token invalid' });
  }
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
