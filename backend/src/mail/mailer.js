import 'dotenv/config';
import nodemailer from 'nodemailer';

const isProduction = process.env.NODE_ENV === 'production';

const transporter = nodemailer.createTransport({
  host: isProduction ? process.env.MAIL_HOST : process.env.DEV_MAIL_HOST,
  port: isProduction ? parseInt(process.env.MAIL_PORT) : parseInt(process.env.DEV_MAIL_PORT),
  secure: isProduction,
  auth: {
    user: isProduction ? process.env.MAIL_USER : process.env.DEV_MAIL_USER,
    pass: isProduction ? process.env.MAIL_PASS : process.env.DEV_MAIL_PASS,
  },
  tls: {
    rejectUnauthorized: !isProduction,
  },
});

const sendEmail = async ({ from, to, subject, text, html }) => {
  try {
    const info = await transporter.sendMail({
      from: from || `"${process.env.MAIL_FROM_NAME}" ${process.env.MAIL_FROM_EMAIL}`,
      to: Array.isArray(to) ? to.join(',') : to,
      subject: subject || 'SiGALF',
      text: text || '',
      html: html || '',
    });

    return info.messageId;
  } catch (error) {
    console.error(`Falha ao enviar o email: ${to}`, error);
    throw new Error('O Email não pôde ser enviado');
  }
};

export default sendEmail;
