const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config');
const Category = require('./category');

const Recipe = sequelize.define('Recipe', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  recipeText: {
    type: DataTypes.TEXT
  },
  imageUrl: {
    type: DataTypes.STRING
  }
}, {
  freezeTableName: true,
  timestamps: true 
});

Recipe.belongsTo(Category);
Category.hasMany(Recipe);

module.exports = Recipe;
