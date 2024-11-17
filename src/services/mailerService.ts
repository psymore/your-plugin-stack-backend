import nodemailer from "nodemailer";

// Send confirmation email
export const sendConfirmationEmail = async (email: string, link: string) => {
  const transporter = nodemailer.createTransport({
    host: process.env.MAILER_HOST,
    port: Number(process.env.MAILER_PORT),
    auth: {
      user: process.env.MAILER_USER,
      pass: process.env.MAILER_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: process.env.MAILER_USER,
    to: email,
    subject: "Email Confirmation",
    text: `Please confirm your email by clicking this link: ${link}`,
  });
};
