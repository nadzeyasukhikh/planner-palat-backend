const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config');

const Category = sequelize.define('Category', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  imageUrl: {
    type: DataTypes.STRING
  }
});

module.exports = Category;