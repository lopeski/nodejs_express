const { DataTypes } = require('sequelize');
const sequelize = require('../../database/connection');

const SoldOUt = sequelize.define('soldout', {
  totalprice: DataTypes.INTEGER,
  itens: DataTypes.ARRAY(DataTypes.TEXT),
});

module.exports = SoldOUt;
