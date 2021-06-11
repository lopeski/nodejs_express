const { DataTypes } = require('sequelize');
const sequelize = require('../../database/connection');

const Address = sequelize.define('address', {
  address: DataTypes.STRING,
  neighborhood: DataTypes.STRING,
  city: DataTypes.STRING,
  cep: DataTypes.STRING,
  state: DataTypes.STRING,
  country: DataTypes.STRING,
  phoneNumber: DataTypes.STRING,
});

// relacionar com:
// cliente

module.exports = Address;
