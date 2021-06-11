const { DataTypes } = require('sequelize');
const sequelize = require('../../database/connection');
const Avaliation = require('./avaliation');
const PaymentClient = require('./paymentMethod');
const Address = require('./address');
const SoldOUt = require('./soldOut');
const Product = require('./product');
const Category = require('./category');
const Faq = require('./faq');

const UserClient = sequelize.define('userClient', {
  name: DataTypes.STRING,
  email: DataTypes.STRING,
  password: DataTypes.STRING,
  device: DataTypes.ARRAY(DataTypes.TEXT),
  tokenAuth: DataTypes.STRING(1000),
  tokenStatic: DataTypes.STRING(1000),
});

(async () => {
  Product.hasMany(Avaliation, { as: 'Avaliation' });
  Avaliation.belongsTo(Product);
  UserClient.hasMany(Avaliation, { as: 'Comment' });
  Avaliation.belongsTo(UserClient);
  Category.hasMany(Product, { as: 'Itens' });
  Product.belongsTo(Category);
  Product.hasMany(Faq, { as: 'faq' });
  Faq.belongsTo(Product);
  Product.hasMany(Avaliation);
  Avaliation.belongsTo(Product);
  UserClient.hasMany(PaymentClient, { as: 'PaymentMethod' });
  PaymentClient.belongsTo(UserClient);
  UserClient.hasMany(Address, { as: 'Address' });
  Address.belongsTo(UserClient);
  UserClient.hasMany(SoldOUt, { as: 'Compras' });
  SoldOUt.belongsTo(UserClient);
  SoldOUt.hasOne(Address);
  Address.belongsTo(SoldOUt);
  await sequelize.sync({ force: true });
})();

module.exports = UserClient;
