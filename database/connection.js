const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('postgres://dbdkkqpodqqlsu:a522f214366dc66742d67892f6c6098a9c4be320d26e89210975024ece811d81@ec2-54-160-96-70.compute-1.amazonaws.com:5432/dd8nkagm9a0j7d', {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

module.exports = sequelize;
