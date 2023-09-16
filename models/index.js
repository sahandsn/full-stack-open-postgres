const Blog = require('./blogs');
const User = require('./users');

User.hasMany(Blog);
Blog.belongsTo(User);

module.exports = {
  Blog,
  User,
};
