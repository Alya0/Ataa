const nodemailer = require('nodemailer')


// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
  host: 'outlook.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: 'ataa2022@outlook.com', 
    pass: '123456789ataa',
  },
});

async function sendCode(code, email) {
  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Ataa" <ataa2022@outlook.com>',
    to: email, 
    subject: "Email verification for Ataa", 
    text: `your code is ${code}`,
  });
}
async function sendEmail(name, email){
  let info = await transporter.sendMail({
    from: '"Ataa" <ataa2022@outlook.com>',
    to: email, 
    subject: "Ataa confirmation", 
    text: `Hello ${name}, you have been accepted to benifit from our charity, kindly visit us`,
  });
}

  module.exports = {sendCode, sendEmail}