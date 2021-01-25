const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const fs = require('fs');
const path = require('path');

const { cifrarRSA, decifrarRSA } = require('../helpers/rsa');

// default options
app.use(fileUpload());

app.post('/encrypt', (req, res)=>{
	let body = req.body;
	let text = body.text;
	
	if( !( text.length > 1 )){
		return res.status(400).json({
			ok: false,
			err: {
				message: 'No enviaste texto para cifrar'
			}
		});
	}

	cifrarRSA( text )
		.then( encData => {
			res.json({
				ok: true,
				encText: encData.toString('base64')
			});
		}).catch( err => {
			return res.status(500).json({
				ok: false,
				err:{
					message: 'Error al cifrar texto',
					desc: err
				}
			});
		});
});

app.post('/decrypt', (req, res)=>{
	let body = req.body;
	let text = body.text;
	
	if( !( text.length > 1 )){
		return res.status(400).json({
			ok: false,
			err: {
				message: 'No enviaste texto para cifrar'
			}
		});
	}

	decifrarRSA( text )
		.then( decData => {
			res.json({
				ok: true,
				text: decData.toString('base64')
			});
		}).catch( err => {
			return res.status(500).json({
				ok: false,
				err:{
					message: 'Error al decifrar texto',
					desc: err
				}
			});
		});
});

module.exports = app;
