const express = require('express');
const api = require('./api');
const { build, port } = require('./config');
const { template } = require('./helpers');

const app = express();

const home = (req, res) => res.send(template());

app.use(express.static(build));

app.use('/api', api);
app.get('/', home);

app.listen(port, () =>
  console.log(`Listening on port ${port}`));
