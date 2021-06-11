const { DataTypes } = require('sequelize');
const sequelize = require('../../database/connection');

const Adm = sequelize.define('UserAdm', {
  name: DataTypes.STRING,
  email: DataTypes.STRING,
  password: DataTypes.STRING,
  tokenAuth: DataTypes.STRING(1000),
  tokenStatic: DataTypes.STRING(1000),
});

module.exports = Adm;
