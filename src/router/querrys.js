const express = require('express');
const { Op } = require('sequelize');
const Product = require('../models/product');
const Category = require('../models/category');

const router = express.Router();

router.get('/search/:name/:pg', async (req, res) => {
  const { name, pg } = req.params;
  const { count, rows } = await Product.findAndCountAll({
    where: {
      title: {
        [Op.like]: `%${name}%`,
      },
      description: {
        [Op.like]: `%${name}%`,
      },
    },
    offset: pg,
    limit: 15,
  })
    .then(() => res.status(200).send(count, rows))
    .catch((e) => res.status(400).send(e));
});

router.get('/searchBetweenValue/:id/:min/:max/:pg', async (req, res) => {
  const {
    id,
    min,
    max,
    pg,
  } = req.params;
  const mini = min || 0;

  const { count, rows } = await Product.findAndCountAll({
    where: {
      cust: {
        [Op.between]: [mini, max],
      },
      categoryId: {
        [Op.eq]: id,
      },
    },
    offset: pg,
    limit: 15,
  })
    .then(() => res.status(200).send(count, rows))
    .catch((e) => res.status(400).send(e));
});

router.get('/searchBySize/:id/:size/:pg', async (req, res) => {
  const {
    id,
    pg,
    size,
  } = req.params;

  const { count, rows } = await Product.findAndCountAll({
    where: {
      size: {
        [Op.like]: `%${size}%`,
      },
      categoryId: {
        [Op.eq]: id,
      },
    },
    offset: pg,
    limit: 15,
  })
    .then(() => res.status(200).send(count, rows))
    .catch((e) => res.status(400).send(e));
});

router.get('/searchBySoldBy/:id/:saller/:pg', async (req, res) => {
  const {
    id,
    pg,
    saller,
  } = req.params;

  const { count, rows } = await Product.findAndCountAll({
    where: {
      soldBy: {
        [Op.eq]: `%${saller}%`,
      },
      categoryId: {
        [Op.eq]: id,
      },
    },
    offset: pg,
    limit: 15,
  })
    .then(() => res.status(200).send(count, rows))
    .catch((e) => res.status(400).send(e));
});

router.get('/searchByColor/:id/:color/:pg', async (req, res) => {
  const {
    id,
    pg,
    color,
  } = req.params;

  const { count, rows } = await Product.findAndCountAll({
    where: {
      color: {
        [Op.like]: `%${color}%`,
      },
      categoryId: {
        [Op.eq]: id,
      },
    },
    offset: pg,
    limit: 15,
  })
    .then(() => res.status(200).send(count, rows))
    .catch((e) => res.status(400).send(e));
});

router.get('/topassociated/:id', async (req, res) => {
  const {
    id,
    color,
  } = req.params;

  const { count, rows } = await Product.findAndCountAll({
    where: {
      categoryId: {
        [Op.eq]: id,
      },
    },
    order: [
      ['views', 'DESC'],
    ],
    limit: 7,
  })
    .then(() => res.status(200).send(count, rows))
    .catch((e) => res.status(400).send(e));
});

router.get('/topassociated/:id', async (req, res) => {
  const {
    id,
  } = req.params;

  const { count, rows } = await Product.findAndCountAll({
    where: {
      categoryId: {
        [Op.eq]: id,
      },
    },
    order: [
      ['views', 'DESC'],
    ],
    limit: 7,
  })
    .then(() => res.status(200).send(count, rows))
    .catch((e) => res.status(400).send(e));
});

router.get('/topsallers/:id', async (req, res) => {
  const {
    id,
  } = req.params;

  const { count, rows } = await Product.findAndCountAll({
    where: {
      categoryId: {
        [Op.eq]: id,
      },
    },
    order: [
      ['salles', 'DESC'],
    ],
    limit: 7,
  })
    .then(() => res.status(200).send(count, rows))
    .catch((e) => res.status(400).send(e));
});

router.get('categorry/:name', async (req, res) => {
  const { name, pag } = req.params;
  Category.findOne({
    where: {
      title: {
        [Op.eq]: name,
      },
    },
    include: [
      {
        model: Product,
        as: 'Itens',
        offset: pag,
        limit: 1,
        attributes: ['id', 'name'],
      },
    ],
  })
    .then((item) => res.status(200).send(item))
    .catch((err) => res.status(400).send(err));
});

router.get('/getdetails/:id', async (req, res) => {
  const { id } = req.params;
  Product.findByPk(id, {
    attributes: ['id', 'name'],
  })
    .then((item) => res.status(200).send(item))
    .catch((err) => res.status(404).send(err));
});

module.exports = (app) => app.use('/querry', router);
