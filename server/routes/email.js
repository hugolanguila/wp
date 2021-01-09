const express = require('express');
const nodemailer = require('nodemailer');
const app = express();

app.post('/email', (req, res)=>{
	
	let email = req.body.email;
	let message = req.body.message;

	const transporter = nodemailer.createTransport({
		service: 'gmail',
		auth:{
			user: process.env.USRSRC,
			pass: process.env.USRPASS
		}
	});

	const mailOptions = {
		from: process.env.USRSRC,
		to: process.env.USRDEST,
		subject:'Contacto CR-WP',		
		text: `From: ${ email }, message: ${ message }`
	};

	transporter.sendMail( mailOptions, (err, info)=>{
		if( err ){
			return res.status(500).json({
				ok: false,
				err
			});
		}	

		res.json({
			ok: true,
			info
		})
	});
});

module.exports = app;
