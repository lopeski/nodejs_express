const express = require('express');
const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
// const nodemailer = require('nodemailer');
const UserClient = require('../models/userClient');
const UserADM = require('../models/UserADM');
const keyADM = require('../../secrets/admSecret.json');
const keyUser = require('../../secrets/authSecret.json');

const autorization = 'autorizado';
const algorithm = 'sha256';
const router = express.Router();

function newToken(params = {}) {
  return jwt.sign({ params }, keyUser.secret, {
    expiresIn: '7d',
  });
}
function newTokenADM(params = {}) {
  return jwt.sign({ params }, keyADM.secret, {
    expiresIn: '7d',
  });
}

function encript(text) {
  const cipher = crypto.createCipher(algorithm, keyUser.secret);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}
function decrypt(text) {
  const decipher = crypto.createDecipher(algorithm, keyUser.secret);
  let decrypted = decipher.update(text, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

// criar usuario cliente
router.post('/registerUserClient', async (req, res) => {
  const { email, password, device } = req.body;

  const itemWhere = await UserClient.findOne({
    where: {
      email,
    },
  });
  if (
    !email
    || !password
    || !device
  ) {
    return res.status(418).send({ error: 'Existe um campo nao prenchido' });
  } else if (itemWhere) {
    return res.status(409).send({ error: 'Infelizmente esse email pertence a outra conta' });
  } else {
    let content = {
      ...req.body,
      tokenAuth: newToken(email + password),
    }

    try {
      const post = await UserClient.create(content);
      return res.status(200).send(post);
    } catch (e) {
      console.log(e);
      return res.status(500).send({ error: 'Email encontrado', e });
    }
  }
});
// criar usuario ADM
router.post('/registerUserADM', async (req, res) => {
  const {
    email,
    password,
    device,
    tokenAcess,
  } = req.body;

  const itemWhere = await UserADM.findOne({
    where: {
      email,
    },
  });

  if (
    !email
    || !password
    || !device
    || !tokenAcess
  ) {
    return res.status(418).send({ error: 'Existe um campo nao prenchido' });
  } else if (itemWhere) {
    return res.status(409).send({ error: 'Infelizmente esse email pertence a outra conta' });
  } else if (tokenAcess !== autorization) {
    return res.status(409).send({ error: 'Infelizmente voce nao tem permissao para essa operacao' });
  } else {
    const content = {
      ...req.body,
      tokenAuth: newTokenADM(email + password),
    };
    await UserADM.create(content)
      .then((post) => res.status(200).send(post))
      .catch((err) => res.status(500).send({ error: 'Falha ao criar novo usuario', err }));
  }
});
// autentica usuario
router.put('/aut/:type', async (req, res) => {
  const { type } = req.params;
  const {
    email, password, device,
  } = req.body;

  try {
    let post;
    switch (type) {
      case 'client':
        post = await UserClient.findOne({
          where: {
            [Op.and]: [{ password }, { email }],
          },
        })
        break;
      case 'saller':
        post = await UserADM.findOne({
          where: {
            [Op.and]: [{ password }, { email }],
          },
        })
        break;
      default:
        return res.status(500).send({ error: 'type undefined' });
    }
    const array = [...post.device];
    const found = array.find((element) => element === device);

    if (found) {
      post.tokenAuth = newToken(email + password + device);
      await post.save();

      return res.status(200).send(post.tokenAuth);
    } else {
      return res.status(404).send({ mensage: 'Device nao registrado' });
    }
  } catch (e) {
    return res.status(412).send({ error: 'Senha ou password incorreto', e });
  }
  // return res.status(200).send(post);
});
// Cria um novo token
router.put('/revalidaty/:type', async (req, res) => {
  const {
    email, token,
  } = req.body;
  const { type } = req.params;

  let post;
  switch (type) {
    case 'client':
      post = await UserClient.findOne({
        where: {
          [Op.and]: [{ email }, { tokenAuth: token }],
        },
      });
      break;
    case 'saler':
      post = await UserADM.findOne({
        where: {
          [Op.and]: [{ email }, { tokenAuth: token }],
        },
      });
      break;
    default:
      return res.status(500).send({ error: 'type undefined' });
  }
  try {
    if (post) {
      post.tokenAuth = newToken(email + post.password);
      await post.save();
      return res.status(200).send(post.tokenAuth);
    } else {
      return res.status(400).send({ error: 'algo deu errado. #NN' });
    }
  } catch (e) {
    return res.status(500).send({ error: 'algo deu errado', e });
  }
});
// enviar email de novo  dispositivo
router.post('/lintSend', async (req, res) => {
  // try {
  //   const testAccount = await nodemailer.createTestAccount();
  //   // create reusable transporter object using the default SMTP transport
  //   const transporter = nodemailer.createTransport({
  //     host: 'smtp.ethereal.email',
  //     port: 587, d
  //     secure: false, // true for 465, false for other ports
  //     auth: {
  //       user: testAccount.user, // generated ethereal user
  //       pass: testAccount.pass, // generated ethereal password
  //     },
  //   });
  //   // send mail with defined transport object
  //   transporter.sendMail({
  //     from: '<email@example.com>', // sender address
  //     to: '<client@email.com>', // list of receivers
  //     subject: 'Foi voce quem tentou se conectar agora?', // Subject line
  //     text: 'Ola voce quem tentou entrar no nosso sistema? LINK', // plain text body
  //   });
  //
  //   return res.status(200).send({ mensage: 'email enviado' });
  // } catch (e) {
  //   return res.status(500).send({ error: 'Senha ou password incorreto', e });
  // }
});

router.get('/linkRecibe/:token/:email/:device', async (req, res) => {
  try {
    const { email, token, device } = req.params;
    const user = await UserClient.findOne({
      where: {
        [Op.and]: [{ email }, { tokenStatic: token }],
      },
    });
    const array = [...user.device];
    array.push(device);
    user.device = array;
    return res.status(200).send({ mensage: 'mudanca confirmada' });
  } catch (e) {
    return res.status(500).send({ error: 'Senha ou password incorreto', e });
  }
});
module.exports = (app) => app.use('/autentication', router);
