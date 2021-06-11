const { DataTypes } = require('sequelize');
const sequelize = require('../../database/connection');

const Faq = sequelize.define('faq', {
  title: DataTypes.STRING,
  question: DataTypes.STRING,
  answers: DataTypes.STRING,
});

module.exports = Faq;
