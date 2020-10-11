const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "seu.email@gmail.com", //email que irá enviar as mensagens
    pass: "5U4S3NH4" //a senha do mesmo email
  }
});


module.exports = transporter;