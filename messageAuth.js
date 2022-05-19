const nodemailer = require('nodemailer')


// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
  host: 'outlook.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: 'ataa2022@outlook.com', // generated ethereal user
    pass: '123456789ataa', // generated ethereal password
  },
});

async function sendCode(code, email) {
  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Ataa" <ataa2022@outlook.com>', // sender address
    to: email, // list of receivers
    subject: "Email verification for Ataa", // Subject line
    text: `your code is ${code}`, // plain text body
  });
	}

	// main().catch(console.error);

  module.exports = sendCode