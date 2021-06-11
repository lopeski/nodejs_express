const { DataTypes } = require('sequelize');
const sequelize = require('../../database/connection');

const Category = sequelize.define('category', {
  title: DataTypes.STRING,
  providers: DataTypes.STRING,
  colors: DataTypes.ARRAY(DataTypes.TEXT),
  size: DataTypes.ARRAY(DataTypes.TEXT),
  soldBy: DataTypes.ARRAY(DataTypes.TEXT),
});
// assosiar com o produto
module.exports = Category;
