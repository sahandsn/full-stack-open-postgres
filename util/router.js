const { Sessions, User } = require('../models');
const { SECRET } = require('./config');
const jwt = require('jsonwebtoken');

const blogFinder = async (req, res, next) => {
  Blog.findByPk(req.params.id, {
    attributes: {
      exclude: ['userId'],
    },
    include: {
      model: User,
      attributes: {
        exclude: ['passwordHash', 'createdAt', 'updatedAt', 'id'],
      },
    },
  })
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

const tokenExtractor = async (req, res, next) => {
  const authorization = req.get('authorization');
  if (authorization?.toLowerCase().startsWith('bearer ')) {
    try {
      const decodedToken = jwt.verify(authorization.substring(7), SECRET);
      const session = await Sessions.findOne({
        where: {
          userId: decodedToken.id,
        },
      });
      if (!session) {
        return res.status(401).json({ error: 'expired token' });
      }
      const istokenExpired =
        new Date(session.expiryDate).toUTCString() < new Date().toUTCString();
      if (istokenExpired) {
        return res.status(401).json({ error: 'token expired' });
      }
      const user = await User.findOne({
        where: {
          id: decodedToken.id,
        },
      });
      if (!user) {
        return res.status(401).json({ error: 'user not found' });
      }
      if (user.isDisabled) {
        return res.status(401).json({ error: 'user is disabled' });
      }

      req.decodedToken = decodedToken;
    } catch {
      return res.status(401).json({ error: 'token invalid' });
    }
  } else {
    return res.status(401).json({ error: 'token missing' });
  }
  next();
};

module.exports = {
  blogFinder,
  tokenExtractor,
};
