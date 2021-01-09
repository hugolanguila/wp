const crypto = require('crypto');
const NodeRSA = require('node-rsa');

const pubkey = new NodeRSA( process.env.PUBLICKEY );
const privkey = new NodeRSA( process.env.PRIVATEKEY );

const encryptText = ( text ) =>{
	const encryptedText = pubkey.encrypt( text, 'base64' );
	return encryptedText;	
}

const encrypt = async( data ) => {
	return new Promise((resolve, reject)=>{	
			let encData = encryptText( data );
			resolve( encData );
		})
		.catch( err => reject(err));
}

const decryptText = ( text ) =>{
	const decryptedText = privkey.decrypt( text, 'utf8' );
	return decryptedText;	
}

const decrypt = async( data ) => {
	return new Promise((resolve, reject)=>{	
			let decData = decryptText( data );
			resolve( decData );
		})
		.catch( err => reject(err));
}

module.exports = {
	encrypt, 
	decrypt
}

