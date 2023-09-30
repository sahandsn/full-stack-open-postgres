const router = require('express').Router();
const { tokenExtractor } = require('../util/router');
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

router.put('/:id', tokenExtractor, async (req, res, next) => {
  console.log('from the decoded token', req.decodedToken);
  const rel = await UsersBlogs.findByPk(req.params.id);
  if (rel) {
    if (!Object.hasOwn(req.body, 'read')) {
      next({ type: 'putReadinglistRead' });
    }
    rel.read = req.body.read;
    rel
      .save()
      .then(() => {
        return res.status(200).json(rel);
      })
      .catch((err) => {
        next(err);
      });
  } else {
    next({ type: 'putReadinglistNotFound' });
  }
});

module.exports = router;
