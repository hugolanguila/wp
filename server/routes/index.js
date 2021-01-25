const express = require('express');

const app = express();

app.use(require('./cv'));
app.use(require('./email'));
app.use(require('./key'));
app.use(require('./upload'));
app.use(require('./firma'));
app.use(require('./hibrido'));

app.get('/', (req, res)=>{
	path.join(__dirname, '../../public/index.html');
});


module.exports = app;
