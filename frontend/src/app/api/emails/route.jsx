// app/api/emails/route.jsx
import { render } from "@react-email/components";
import nodemailer from "nodemailer";
import { NextResponse } from "next/server";
import ProblemPiperWelcomeEmail from "../../../../emails/email";

export async function POST(request) {
  try {
    const { email, username } = await request.json();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
    });

    // Verify connection
    await transporter.verify();

    const emailHtml = await render(
      <ProblemPiperWelcomeEmail username={username} />
    );

    const options = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Welcome to Problem Piper!",
      html: emailHtml,
    };

    const info = await transporter.sendMail(options);
    console.log("Message sent: %s", info.messageId);

    return NextResponse.json(
      { message: "Email sent successfully", messageId: info.messageId },
      { status: 200 }
    );
  } catch (error) {
    console.error("Email sending error:", error);
    return NextResponse.json(
      { error: "Failed to send email", details: error.message },
      { status: 500 }
    );
  }
}
