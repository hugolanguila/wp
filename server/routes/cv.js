const express = require( 'express' );
const path = require('path');
const app = express();

app.get('/cv', (req, res)=>{
	return res.sendFile(path.resolve(__dirname, '../assets/cv.pdf'));
});

module.exports = app;
