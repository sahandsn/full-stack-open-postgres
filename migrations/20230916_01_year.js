const { DataTypes } = require('sequelize');

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn('blogs', 'year', {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: {
          args: 1991,
          msg: `publication year must be 1991 or later`,
        },
        max: {
          args: new Date().getFullYear(),
          msg: `publication year can't be in the future`,
        },
      },
      defaultValue: new Date().getFullYear(),
    });
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn('blogs', 'year');
  },
};
