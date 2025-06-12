import nodemailer from "nodemailer";
import config from "config";

class MailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      host: config.get("smtp.host"),
      port: config.get("smtp.port"),
      secure: false,
      auth: {
        user: config.get("smtp.user"),
        pass: config.get("smtp.password"),
      },
    });
  }

  async sendMail(toEmail, subject, html) {
    await this.transporter.sendMail({
      from: config.get("smtp.user"),
      to: toEmail,
      subject,
      html,
    });
  }

  async sendVerificationLink(toEmail, full_name, link) {
    const html = `
      <div style="font-family: Arial, sans-serif">
        <h2>Salom, ${full_name}!</h2>
        <p>ITTerm tizimidagi profilingizni faollashtirish uchun quyidagi havolani bosing:</p>
        <a href="${link}" target="_blank" style="background: #4caf50; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px;">Profilni faollashtirish</a>
        <p>Havola 24 soat amal qiladi.</p>
      </div>
    `;
    await this.sendMail(toEmail, "ITTerm - Profilingizni faollashtiring", html);
  }
}

export default new MailService();
