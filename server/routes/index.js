const express = require('express');

const app = express();

app.use(require('./cv'));
app.use(require('./email'));
app.use(require('./key'));
app.use(require('./upload'));

module.exports = app;
