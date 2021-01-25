const crypto = require('crypto');

const firmar = ( texto, privatekey = process.env.PRIVATEKEY ) => {
	let signer = crypto.createSign('sha256');
	signer.update( texto );
	signer.end();
	let firma = signer.sign( privatekey );
	let buffer = Buffer.from( firma );
	return buffer.toString('base64');
}

const verificar = ( texto, firma, publickey = process.env.PUBLICKEY ) => {
	let verifier = crypto.createVerify('sha256');
	verifier.update( texto );
	verifier.end();
	return verifier.verify( publickey, firma, 'base64' );
}

module.exports = {
	firmar, 
	verificar
}
