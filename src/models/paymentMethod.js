const { DataTypes } = require('sequelize');
const sequelize = require('../../database/connection');

const PaymentClient = sequelize.define('paymentMethodClient', {
  numberOfCard: DataTypes.STRING,
  validaty: DataTypes.STRING,
  nameOfCard: DataTypes.STRING,
  codysecurty: DataTypes.STRING,
});

module.exports = PaymentClient;

//  testar
// fazer teste automatizados
// fazer read.me bonito
// documentar no read.me
// comentar o codigo
//  finalizar codificacao
//
//
//
//
//
//
//
