const express = require('express');
const app = express();

app.use(require('./user'));
app.use(require('./patient'));
app.use(require('./login'));
app.use(require('./dailyRecord'));
app.use(require('./catalog'));
app.use(require('./notification'));





module.exports = app;