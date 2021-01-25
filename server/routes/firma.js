const express = require('express');
const app = express();

const { firmar, verificar } = require('./../helpers/firma');

app.post('/firmar', (req, res)=>{
	let body = req.body;
	let { texto } = body;

	if( !( texto.length > 0 )){
		return res.status(500).json({
			ok: false,
			err: {
				message: 'No enviaste el texto a firmar'	
			}
		});
	}

	let firma = firmar( texto );
	return res.json({
		ok: true,
		firma: {
			texto,
			firma
		}
	});
});

app.post('/verificar', (req, res)=>{
	let body = req.body;
	let { texto, firma, publickey } = body;

	if( !( texto.length > 0 ) || !( firma.length > 0 ) ){
		return res.status(500).json({
			ok: false,
			err: {
				message: 'No enviaste los parametros adecuadamente'	
			}
		});
	}
	
	let veredicto;
	if( !publickey ){
		veredicto = verificar( texto, firma );
	}else{
		veredicto = verificar( texto, firma, publickey );
	}
	
	if( veredicto ){
		return res.json({
			ok: true,
			resultado: {
				veredicto,
				message: 'El origen de los datos es seguro'
			}
		});
	}else{
		return res.json({
			ok: true,
			resultado: {
				veredicto,
				message: 'El origen de los datos no es seguro'
			}
		});
	}
});

module.exports = app;
