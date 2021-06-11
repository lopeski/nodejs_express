const express = require('express');
const { Op } = require('sequelize');
const User = require('../models/userClient');

const middlware = require('../../middleware/authClient');

const router = express.Router();

router.use(middlware);

router.put('/getdetails', async (req, res) => {
  const { id, token } = req.params;
  User.findOne({
    where: {
      tokenAuth: {
        [Op.eq]: token,
      },
      id: {
        [Op.eq]: id,
      },
    },
  })
    .then((item) => res.status(200).send(item))
    .catch((err) => res.status(404).send(err));
});

router.put('/updateItem', async (req, res) => {
  const { id, name } = req.body;
  try {
    const item = User.findByPk(id);
    item.name = name;
    await item.save();
    return res.status(200).send(item);
  } catch (e) {
    return res.status(400).send(e);
  }
});

module.exports = (app) => app.use('/user', router);
