const express = require('express');
const { Op } = require('sequelize');
const UserClient = require('../models/userClient');
const Product = require('../models/product');
const Comments = require('../models/avaliation');
const Faq = require('../models/faq');
const PaymentMethod = require('../models/paymentMethod');
const SoldOut = require('../models/soldOut');

const middlware = require('../../middleware/authClient');

const router = express.Router();
function pagamento() {
  const content = {
    algo: 'algo',
  };
  try {
    return content;
  } catch (e) {
    return e;
  }
}
router.get('/product/:id', async (req, res) => {
  const { id } = req.params;
  Product.findByPk(id)
    .then((item) => res.status(200).send(item))
    .catch((err) => res.status(404).send({ erro: 'nao deu cara', err }));
});
router.get('/faq/:id', async (req, res) => {
  const { id } = req.params;
  Faq.findOne({
    where: {
      productId: id,
    },
  })
    .then((item) => res.status(200).send(item))
    .catch((err) => res.status(404).send({ erro: 'nao deu cara', err }));
});

router.get('/comments/:id', async (req, res) => {
  const { id } = req.params;
  Comments.findOne({
    where: {
      productId: {
        [Op.eq]: id,
      },
    },
  })
    .then((item) => res.status(200).send(item))
    .catch((err) => res.status(404).send(err));
});

router.use(middlware);

router.post('/comments', async (req, res) => {
  const {
    title,
    question,
    answers,
    country,
    note,
    body,
    userId,
    id,
  } = req.body;
  Comments.create({
    title,
    country,
    note,
    body,
    productId: id,
    userClientId: userId,
  })
    .then((item) => res.status(200).send(item))
    .catch((err) => res.status(404).send(err));
});

router.delete('/dltcomments', async (req, res) => {
  const { id } = req.body;
  console.log(id);
  try {
    const comments = await Comments.findByPk(id);
    console.log(comments);
    await comments.destroy();
    return res.status(200).send({ mensage: 'item deletado' });
  } catch (e) {
    return res.status(400).send(e);
  }
});

router.put('/buy', async (req, res) => {
  const { id } = req.params;
  const user = UserClient.findByPk(id, {
    include: [
      {
        model: PaymentMethod,
        as: 'Payment',
      },
    ],
  });
  try {
    return res.status(200).send({ mensage: 'pagamento concludio' });
  } catch (e) {
    return res.status(400).send(e);
  }
});

module.exports = (app) => app.use('/itemResult', router);
