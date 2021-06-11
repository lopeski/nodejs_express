const express = require('express');
const Product = require('../models/product');
const Category = require('../models/category');
const Faq = require('../models/faq');

const middlware = require('../../middleware/authADM');

const router = express.Router();

router.use(middlware);

let content;

function updateCategory(saller, color, size, id) {
  const sizes = [...size];
  const colors = [...color];
  const brand = [...saller];
  try {
    const categ = Category.findByPk(id);
    categ.colors = colors;
    categ.size = sizes;
    categ.soldBy = brand;
    categ.save();
  } catch (e) {
    console.error(e, 'erro aqui');
  }
}
function contentFunction(body, id) {
  content = {
    ...body,
    categoryId: id,
  };
  return content;
}

router.post('/create', async (req, res) => {
  const {
    categoryName,
    seller,
    color,
    size,
    title,
    cust,
    discount,
    addition,
    regionDiscount,
    regionAddition,
    soldBy,
    description,
    amount,
    views,
    salles,
  } = req.body;

  try {
    const [body, created] = await Category.findOrCreate({
      where: { title: categoryName },
    });
    const areadyCategory = await Category.findByPk(body.dataValues.id);
    const arraySize = [];
    const arrayColor = [];
    const arraySoldby = [];
    //
    if (areadyCategory.size === null) {
      arraySize.push(areadyCategory.size);
    }
    if (areadyCategory.colors === null) {
      arrayColor.push(areadyCategory.colors);
    }
    if (areadyCategory.soldBy === null) {
      arraySoldby.push(areadyCategory.soldBy);
    }
    const foundSize = arraySize.find((element) => element === size);
    const foundColor = arrayColor.find((element) => element === color);
    const foundSoldby = arraySoldby.find((element) => element === soldBy);
    if (foundSize === undefined) {
      arraySize.push(size);
      areadyCategory.size = arraySize;
      await body.save();
    }
    if (foundColor === undefined) {
      arrayColor.push(color);
      areadyCategory.colors = arrayColor;
      await body.save();
    }
    if (foundSoldby === undefined) {
      arraySoldby.push(soldBy);
      areadyCategory.soldBy = arraySize;
      await body.save();
    }

    const finalProduct = await Product.create({
      title,
      cust,
      discount,
      addition,
      regionDiscount,
      regionAddition,
      size,
      soldBy,
      color,
      description,
      amount,
      views,
      salles,
      categoryId: areadyCategory.id,
    });
    return res.status(200).send({ mensage: 'item criados', areadyCategory, finalProduct });
  } catch (e) {
    return res.status(500).send({ error: e });
  }
});

router.post('/createFaq', async (req, res) => {
  const {
    id,
    title,
    question,
    answers,
  } = req.body;
  // await Product.findByPk(id)
  //   .then((item) => {
  //   })
  //   .catch((err) => res.status(404).send({ error: err }));
  try {
    const Prod = await Product.findByPk(id);
    if (Prod) {
      await Faq.create({
        title, question, answers, productId: Prod.id,
      })
        .then((result) => res.status(200).send({ mensage: 'faq criado', result }))
        .catch((err) => res.status(404).send({ error: err }));
    } else {
      return res.status(404).send({ erro: 'erro' })
    }
  } catch (e) {
    return res.status(400).send(e);
  }
});

router.get('/getdetails/:id', async (req, res) => {
  const { id } = req.params;
  Product.findByPk(id)
    .then((item) => res.status(200).send(item))
    .catch((err) => res.status(404).send(err));
});

router.put('/updateItem', async (req, res) => {
  const { id, name } = req.body;
  try {
    const item = await Product.findByPk(id);
    item.name = name;
    await item.save();
    return res.status(200).send(item);
  } catch (e) {
    return res.status(400).send(e);
  }
});

router.delete('/apItem', async (req, res) => {
  const { id } = req.body;
  try {
    const item = await Product.findByPk(id);
    await item.destroy();
    return res.status(200).send({ mensage: 'item delete' });
  } catch (e) {
    return res.status(400).send(e);
  }
});
module.exports = (app) => app.use('/item', router);
