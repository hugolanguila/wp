const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const fs = require('fs');
const path = require('path');

const { encrypt, decrypt } = require('../helpers/cipher');

// default options
app.use(fileUpload());

app.put('/encrypt', (req, res) => {
    if (!req.files) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: 'No se ha seleccionado ningún archivo'
                }
            });
    }

    let archivo = req.files.file;
    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length - 1];

    // Extensiones permitidas
    let extensionesValidas = ['txt'];
    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones permitidas son ' + extensionesValidas.join(', '),
                ext: extension
            }
        })
    }

	let data = archivo.data.toString('utf8');
	encrypt( data )
		.then( encData => {
			let nombre = nombreCortado[0] + '_C.txt';
			let rutaArchivo = path.resolve(__dirname, `../../uploads/${ nombre }`);

			fs.appendFile( rutaArchivo, encData, { encoding: 'base64' }, (err)=>{
				if( err ){
					return res.status(500).json({
						ok: false,
						message: 'Error al escribir archivo',
						err
					});
				}
				res.sendFile( rutaArchivo, (err)=>{
					borrarArchivo( nombre );
				});
			});


		}).catch( err => {
			return res.status(500).json({
				ok: false,
				message: 'Error al cifrar archivo', 
				err
			});
		});

});

app.put('/decrypt', (req, res) => {
    if (!req.files) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: 'No se ha seleccionado ningún archivo'
                }
            });
    }

    let archivo = req.files.file;
    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length - 1];

    // Extensiones permitidas
    let extensionesValidas = ['txt'];
    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones permitidas son ' + extensionesValidas.join(', '),
                ext: extension
            }
        })
    }


	let data = archivo.data.toString('base64');
	decrypt( data )
		.then( decData => {
			let nombre = nombreCortado[0] + '_D.txt';
			let rutaArchivo = path.resolve(__dirname, `../../uploads/${ nombre }`);

			fs.appendFile( rutaArchivo, decData, { encoding: 'utf8' }, (err)=>{
				if( err ){
					return res.status(500).json({
						ok: false,
						message: 'Error al escribir archivo',
						err
					});
				}
				res.sendFile( rutaArchivo, (err)=>{
					borrarArchivo( nombre );
				});
			});
		}).catch( err => {
			return res.status(500).json({
				ok: false,
				message: 'Error al cifrar archivo', 
				err
			});
		});

});


function borrarArchivo ( nombre ) {
    let rutaArchivo = path.resolve(__dirname, `../../uploads/${ nombre }`);
    if (fs.existsSync( rutaArchivo )) {
        fs.unlinkSync( rutaArchivo );
    }
}

module.exports = app;
