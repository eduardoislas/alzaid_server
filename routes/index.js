const express = require('express');
const app = express();

app.use(require('./user'));
app.use(require('./patient'));
app.use(require('./caregiver'));
app.use(require('./login'));
app.use(require('./dailyRecord'));
app.use(require('./catalog'));
app.use(require('./notification'));
app.use(require('./upload'));
app.use(require('./binnacle'));
app.use(require('./valorations'));
app.use(require('./scale'));
app.use(require('./queries'));






module.exports = app;