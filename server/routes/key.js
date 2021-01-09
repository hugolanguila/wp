const express = require('express');
const crypto = require('crypto');
const app = express();

app.get('/key', (req, res)=>{
	let bytes = crypto.randomBytes( 16 );
	res.json({
		ok: true,
		key: process.env.PUBKEY
	});

});

module.exports = app;
