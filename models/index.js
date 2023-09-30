const Blog = require('./blogs');
const User = require('./users');
const UsersBlogs = require('./usersBlogs');
const Sessions = require('./sessions')

User.hasMany(Blog);
Blog.belongsTo(User);

User.belongsToMany(Blog, { through: UsersBlogs, as: 'reading_list' });
Blog.belongsToMany(User, { through: UsersBlogs, as: 'reading_list' });

module.exports = {
  Blog,
  User,
  UsersBlogs,
  Sessions
};
