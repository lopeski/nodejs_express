const jwt = require('jsonwebtoken');
const secredo = require('../secrets/admSecret.json');

module.exports = (req, res, next) => {
  const autoHe = req.headers.authorization;

  if (!autoHe) {
    return res.status(401).send({ error: 'Token nao informado' });
  }
  const parts = autoHe.split(' ');
  if (!parts.lenght === 2) {
    return res.status(401).send({ error: 'Token error' });
  }
  const [token] = parts;
  jwt.verify(token, secredo.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ error: 'Token invalid' });
    }
    req.userId = decoded.params;
    return next();
  });
};
