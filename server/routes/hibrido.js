const express = require('express');
const app = express();

const { firmar, verificar } = require('./../helpers/firma');
const { cifrarLlave, decifrarLlave } = require('./../helpers/rsa');
const { cifrar, decifrar } = require('./../helpers/aes');

/* 
	MENSAJE: MENSAJE A CIFRAR.
	PASSWORD : SECRETO ENTRE LAS DOS PARTES
	PUBLICKEY : LLAVE PUBLICA DEL RECEPTOR
	PRIVATEKEY : LLAVE PRIVADA DEL EMISOR
*/
app.post('/cifradorhibrido', async ( req, res )=>{
	let body = req.body;
	let { mensaje, password, publickey, privatekey } = body;

	if( !mensaje ){
		return res.json({
			ok: false,
			err: {
				message: 'No enviaste los parametros adecuados'
			}
		});
	}

	if( !password ){
		password = process.env.PASSWORD;
	}
	
	if( !privatekey ){
		privatekey = process.env.PRIVATEKEY;
	}
	
	if( !publickey ){
		publickey = process.env.PUBLICKEY;
	}

	try{
		let mensajeCifrado = await cifrar( mensaje, password );
		let llaveCifrada = await cifrarLlave( password, publickey );
		let firma = await firmar( mensaje, privatekey );

		return res.json({
			mensajeCifrado,
			llaveCifrada,
			firma
		});
	}catch( err ){
		return res.status(500).json({
			ok: false,
			err: {
				message: 'No se pudo cifrar el mensaje',
				err
			}
		});
	}	
});

/* 
	MENSAJE: MENSAJE A DECIFRAR.
	PASSWORD : SECRETO ENTRE LAS DOS PARTES ( CIFRADO )
	FIRMA: FIRMA DEL MENSAJE 
	PRIVATEKEY : LLAVE PRIVADA DEL RECEPTOR
	PUBLICKEY: LLAVE PUBLICA DEL EMISOR
*/

app.post('/decifradorhibrido', async ( req, res )=>{
	let body = req.body;
	let { mensaje, password, firma, publickey, privatekey } = body;

	console.log(body);

	if( !mensaje ){
		return res.json({
			ok: false,
			err: {
				message: 'No enviaste los parametros adecuados'
			}
		});
	}

	if( !password ){
		password = process.env.PASSWORD;
	}
	
	if( !privatekey ){
		privatekey = process.env.PRIVATEKEY;
	}
	
	if( !publickey ){
		publickey = process.env.PUBLICKEY;
	}

	try{
		let llaveDecifrada = await decifrarLlave( password, privatekey );
		
		let msj = await decifrar( mensaje, llaveDecifrada );
		console.log(msj);
		if( verificar( msj, firma, publickey ) ){
			res.json({
				mensaje: msj,
				info:'El origen de los datos es seguro'
			});
		}else{
			res.json({
				mensaje: msj,
				info: ' El origen de los datos no es seguro'
				
			});
		}
	}catch( err ){
		return res.status(500).json({
			ok: false,
			err: {
				message: 'No se pudo decifrar el mensaje',
				err
			}
		});
	}	
});

module.exports = app;
