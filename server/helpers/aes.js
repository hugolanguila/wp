const crypto = require('crypto');

const algorithm = 'aes-256-cbc';
const buff = Buffer.alloc(16);
const iv = crypto.randomFillSync( buff );

const cifrar = ( datos, password  ) => {
	return new Promise((resolve, reject) => {
		try{
			let key = crypto.scryptSync( password, 'salt', 32);
			let cipher = crypto.createCipheriv( algorithm, key, iv );
			let textoCifrado = cipher.update( datos, 'utf8', 'base64');
			textoCifrado += cipher.final('base64');
			resolve( textoCifrado );
		}catch( err ){
			reject( err )
		}
	});
};

const decifrar = ( datos, password  ) => {
	return new Promise((resolve, reject) => {
		try{	
			let key = crypto.scryptSync( password, 'salt', 32);
			let decipher = crypto.createDecipheriv( algorithm, key, iv );
			let textoDecifrado = decipher.update( datos, 'base64', 'utf8' );
			textoDecifrado += decipher.final('utf8');
			resolve( textoDecifrado );
		}catch( err ){
			reject( err )
		}
	});
}


module.exports = {
	cifrar,
	decifrar
}
