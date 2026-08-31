import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  // 1) Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT, 10),
    secure: false,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
    // logger: true, // Output logs to console
    // debug: true, // Include SMTP traffic in logs
  });

  // 2) Define the email options
  const mailOptions = {
    from: 'Dinesh Lama <dineshklama3@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // 3) Actually send the email
  await transporter.verify();
  await transporter.sendMail(mailOptions);
};

export default sendEmail;
