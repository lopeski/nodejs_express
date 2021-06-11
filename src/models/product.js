const { DataTypes } = require('sequelize');
const sequelize = require('../../database/connection');

const Product = sequelize.define('product', {
  title: DataTypes.STRING,
  cust: DataTypes.INTEGER,
  discount: DataTypes.INTEGER,
  addition: DataTypes.INTEGER,
  regionDiscount: DataTypes.ARRAY(DataTypes.TEXT),
  regionAddition: DataTypes.ARRAY(DataTypes.TEXT),
  note: DataTypes.INTEGER,
  size: DataTypes.STRING,
  soldBy: DataTypes.STRING,
  color: DataTypes.ARRAY(DataTypes.TEXT),
  images: DataTypes.ARRAY(DataTypes.TEXT),
  description: DataTypes.STRING,
  amount: DataTypes.INTEGER,
  views: DataTypes.INTEGER,
  salles: DataTypes.INTEGER,
});

module.exports = Product;
