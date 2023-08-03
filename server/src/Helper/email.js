const nodemailer = require("nodemailer");
const { smptUsername, smptPassword } = require("../screct");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: smptUsername,
    pass: smptPassword,
  },
});

const emailWithNodemail = async (emailData) => {
  try {
    const mailOption = {
      from: smptUsername, // sender address
      to: emailData.email, // list of receivers
      subject: emailData.subject, // Subject line
      html: emailData.html, // html body
    };
    const info = await transporter.sendMail(mailOption);
    console.log(`message sent : ${info.response}`);
  } catch (error) {
    console.error(`error Occured while sending message`);
    throw error;
  }
};

// export
module.exports = { emailWithNodemail };
