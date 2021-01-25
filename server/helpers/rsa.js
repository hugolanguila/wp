const crypto = require('crypto');
const NodeRSA = require('node-rsa');

const pubkey = new NodeRSA( process.env.PUBLICKEY );
const privkey = new NodeRSA( process.env.PRIVATEKEY );

const cifrarTexto = ( texto ) =>( pubkey.encrypt( texto, 'base64' ) );

const cifrarRSA = async( texto ) => {
	return new Promise((resolve, reject)=>{	
			let textoCifrado = cifrarTexto(texto );
			resolve( textoCifrado );
		})
		.catch( err => reject(err));
}

const decifrarTexto = ( text ) =>( privkey.decrypt( text, 'utf8' ) );

const decifrarRSA = async( texto ) => {
	return new Promise((resolve, reject)=>{	
			let textoDecifrado = decryptText( texto );
			resolve( textoDecifrado );
		})
		.catch( err => reject(err));
}

const cifrarLlave = ( data, publickey = process.env.PUBLICKEY ) => {
	return new Promise( (resolve, reject) =>{
		try{
			resolve( new NodeRSA( publickey ).encrypt( data, 'base64' ) );
		}catch(err){
			reject( err );
		}
	}); 
};

const decifrarLlave = ( data, privatekey = process.env.PRIVATEKEY ) => {
	return new Promise( (resolve, reject) =>{
		try{
			resolve( new NodeRSA( privatekey ).decrypt( data, 'utf8' ));
		}catch(err){
			reject( err );
		}
	}); 
};

module.exports = {
	cifrarRSA, 
	decifrarRSA,
	cifrarLlave,
	decifrarLlave
}

