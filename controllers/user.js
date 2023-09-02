const router = require('express').Router();
const bcrypt = require('bcrypt');

const { User, Blog } = require('../models');

router.get('/', async (req, res) => {
  const users = await User.findAll({
    inclide: {
      mpdel: Blog,
      attributes: { exclude: ['userId'] },
    },
  });
  res.json(users);
});

router.post('/', async (req, res, next) => {
  const saltRounds = 10;
  try {
    const { name, username, password } = req.body;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    User.create({
      name,
      username,
      passwordHash,
    })
      .then((createdUser) => {
        return res.json(createdUser);
      })
      .catch((error) => {
        console.log(error);
        next(error);
      });
  } catch (error) {
    return res.status(400).json({ error });
  }
});

router.get('/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (user) {
    res.json(user);
  } else {
    res.status(404).end();
  }
});

router.put('/:username', async (req, res) => {
  const user = await User.findOne({
    where: {
      username: req.params.username,
    },
  });
  user.username = req.body.username;
  user
    .save()
    .then(() => {
      return res.status(200).json(user);
    })
    .catch((err) => {
      err.type = 'put';
      next(err);
    });
});

module.exports = router;
