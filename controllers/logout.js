const bcrypt = require('bcrypt');
const router = require('express').Router();
const { tokenExtractor } = require('../util/router');

const User = require('../models/users');
const Sessions = require('../models/sessions');

router.delete('/', tokenExtractor, async (request, response) => {
  const { id: userId } = request.decodedToken;
  Sessions.destroy({
    where: {
      userId,
    },
  })
    .then(() => {
      response.status(200).json({ msg: 'come back soon!' });
    })
    .catch((err) => {
      console.log(err);
      response.status(400).json({ error: 'could not logout' });
    });
});

module.exports = router;
