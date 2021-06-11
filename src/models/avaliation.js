const { DataTypes } = require('sequelize');
const sequelize = require('../../database/connection');

const Avaliation = sequelize.define('avaliation', {
  title: DataTypes.STRING,
  country: DataTypes.STRING,
  note: DataTypes.INTEGER,
  body: DataTypes.STRING,
});
// assosiar ao cliente e produto
module.exports = Avaliation;
