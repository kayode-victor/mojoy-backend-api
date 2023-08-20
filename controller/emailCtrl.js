const nodemailer = require("nodemailer");
const { SMTP_HOST, SMTP_PORT, SMTP_MAIL, SMTP_PASSWORD } = process.env;

const sendEmail = async (
  { email, subject, message, activationUrl },
  callback
) => {
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    auth: {
      user: SMTP_MAIL,
      pass: SMTP_PASSWORD,
    },
  });

  try {
    await transporter.sendMail({
      from: SMTP_MAIL,
      to: email,
      subject: subject,
      html: `<p>${message}</p> <a href="${activationUrl}">${activationUrl}</a>`,
    });

    if (callback) {
      callback();
    }

    console.log(`Email sent to ${email}`);
  } catch (error) {
    console.log(`Error occurred while sending email to ${email}: ${error}`);
    throw error;
  }
};

module.exports = sendEmail;
