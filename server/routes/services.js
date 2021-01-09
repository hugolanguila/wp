const fs = require('fs');
const path = require('path');
const express = require('express');
const fileUpload = require('express-fileupload');
const { encrypt, decrypt } = require('../../helpers/cipher');

const app = express();
app.use(fileUpload( { useTempFiles: false } ));

app.post('/encrypt', (req, res)=>{
	
	if( !req.files ){
		return res.status(400).json({
			ok: false, 
			err: 'No se envio ningun archivo'
		});
	}

	let file = req.files.file;
	let extension = file.name.split('.')[1];
	if( extension !== 'txt' ){
		return res.status(400).json({
			ok: false, 
			err: 'No es un archivo de texto'
		});
	}

	let data = file.data.toString('utf8');
	encrypt( data )
		.then( encData =>{
			const newFN = file.name.split('.')[0] + '_C.txt';
			const newFile = path.resolve( __dirname, `../../tmp/uploads/${ newFN }`);
			fs.appendFile( newFile, encData, { encoding: 'base64' }, (err)=>{

				if( err ){
					return res.status(500).json({
						ok: false, 
						message: 'No se pudo escribir el archivo',
						err
					});
				}

				return res.download( newFile, ( err ) =>{
					if( fs.existsSync( newFile ) ){
						fs.unlinkSync( newFile );
					}
				});
			});
		}).catch( err =>{
			return res.status(500).json({
				ok: false, 
				message: 'Error al cifrar archivo',
				err
			});
		});
});


app.post('/decrypt', (req, res)=>{
	
	if( !req.files ){
		return res.status(400).json({
			ok: false, 
			err: 'No se envio ningun archivo'
		});
	}

	let file = req.files.file;
	let extension = file.name.split('.')[1];
	if( extension !== 'txt' ){
		return res.status(400).json({
			ok: false, 
			err: 'No es un archivo de texto'
		});
	}
	
	let data = file.data.toString('base64');
	decrypt( data )
		.then( decData =>{
			const newFN = file.name.split('_')[0] + '_D.txt';
			const newFile = path.resolve( __dirname, `../../tmp/uploads/${ newFN }`);
			fs.appendFile( newFile, decData, { encoding: 'utf8' }, (err)=>{
				if( err ){
					return res.status(500).json({
						ok: false, 
						message: 'No se pudo escribir el archivo',
						err
					});
				}
				return res.download( newFile, ( err ) =>{
					if( fs.existsSync( newFile ) ){
						fs.unlinkSync( newFile );
					}
				});
			});
		}).catch( err =>{
			return res.status(500).json({
				ok: false, 
				message: 'Error al  decifrar archivo',
				err
			});
		});
});
module.exports = app;
