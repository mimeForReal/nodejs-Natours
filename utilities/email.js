const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.url = url;
    this.firstName = user.name.split(' ')[0];
    this.from = `Candy ${process.env.EMAIL_FROM}`;
  }

  newTransport() {
    if (process.env.ENV_NODE === 'production')
      return nodemailer.createTransport({
        service: 'Resend',
        auth: {
          user: process.env.RESEND_USER,
          pass: process.env.RESEND_PASS,
        },
      });
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      post: process.env.EMAIL_POST,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async send(template, subject) {
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      subject,
      url: this.url,
    });

    const mailoptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.convert(html),
    };

    await this.newTransport().sendMail(mailoptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to the Natours!');
  }

  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password reset token (valid for only 10 mins).',
    );
  }
};
