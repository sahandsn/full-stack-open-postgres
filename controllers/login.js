const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const router = require('express').Router();

const { SECRET } = require('../util/config');
const User = require('../models/users');
const Sessions = require('../models/sessions');

router.post('/', async (request, response) => {
  const { username, password } = request.body;

  const user = await User.findOne({
    where: {
      username: username,
    },
  });

  const isPasswordCorrect = await bcrypt.compare(password, user.passwordHash);

  if (!(user && isPasswordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password',
    });
  }

  const userForToken = {
    username: user.username,
    id: user.id,
  };
  const token = jwt.sign(userForToken, SECRET);
  const decodedToken = jwt.verify(token, SECRET);
  await Sessions.create({
    userId: decodedToken.id,
    expiryDate: decodedToken.exp,
  });

  response
    .status(200)
    .send({ token, username: user.username, name: user.name });
});

module.exports = router;
