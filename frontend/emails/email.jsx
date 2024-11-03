import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

// Keep the username as a prop
export const ProblemPiperWelcomeEmail = ({ username = "Developer" }) => (
  <Html>
    <Head />
    <Preview>
      Welcome to Problem Piper - Your Daily Coding Challenge Companion
    </Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={logoContainer}>
          <Text style={title}>Problem Piper</Text>
        </Section>
        <Text style={paragraph}>Hi {username},</Text>
        <Text style={paragraph}>
          Welcome to Problem Piper! 🎉 We're excited to have you join our
          community of developers committed to daily coding excellence. Your
          journey to mastering algorithmic challenges begins now.
        </Text>
        <Section style={btnContainer}>
          <Button style={button} href="https://problem-piper-0.onrender.com/">
           Visit Website
          </Button>
        </Section>
        <Text style={paragraph}>
          Happy coding!
          <br />
          The Problem Piper team
        </Text>
        <Hr style={hr} />
        <Text style={footer}>
          You're receiving this email because you subscribed to daily coding
          challenges.
          <br />
          You can unsubscribe anytime.
        </Text>
      </Container>
    </Body>
  </Html>
);

export default ProblemPiperWelcomeEmail;

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
};

const logoContainer = {
  textAlign: "center",
  padding: "20px 0",
};

const logo = {
  margin: "0",
  borderRadius: "50%",
  overflow: "hidden",
  objectFit: "cover",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "26px",
  color: "#333",
};

const btnContainer = {
  textAlign: "center",
  margin: "26px 0",
};

const button = {
  backgroundColor: "#4338ca",
  borderRadius: "6px",
  color: "#fff",
  fontSize: "16px",
  textDecoration: "none",
  textAlign: "center",
  display: "block",
  padding: "12px 20px",
  maxWidth: "180px",
  margin: "0 auto",
};

const hr = {
  borderColor: "#e5e7eb",
  margin: "20px 0",
};

const footer = {
  color: "#6b7280",
  fontSize: "12px",
  textAlign: "center",
  lineHeight: "20px",
};

const title = {
  fontSize: "28px",
  fontWeight: "bold",
  color: "#4338ca",
  margin: "0",
};
