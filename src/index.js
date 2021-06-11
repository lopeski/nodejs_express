const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

require('../database/connection');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

require('./router/index')(app);

app.listen(process.env.PORT || 3001, function () {
  console.log('Express server rodando na porta %d in %S', this.address().port, app.settings.env);
});
