import {createTransport} from 'nodemailer';

const transporter = createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, 
    auth: {
      user:  process.env.TESTMAIL, 
      pass: process.env.MAILPASS, 
    },
});

const mailOptions = {
    from: 'Servidor Test Node', 
    to: process.env.TESTMAIL, 
    subject: "Registro exitoso", 
    text: `El usuario ha registrado su cuenta exitosamente.`, 
    html: `<p>El usuario ha registrado su cuenta exitosamente.</p>`,
};

export {transporter,mailOptions}