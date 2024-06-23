import smtplib
import ssl
from email.message import EmailMessage
from core.config import settings

import os

class EmailSender:
    def __init__(self):
        self.email_sender = settings.SENDER_EMAIL
        self.email_password = settings.EMAIL_PASSWORD
        self.smtp_server = 'smtp.gmail.com'
        self.port = 465

        if not self.email_password:
            raise ValueError("Email password not found in environment variables.")

    def send_email(self, receiver: str, subject: str, body: str):
        # Create the email message
        em = EmailMessage()
        em['From'] = self.email_sender
        em['To'] = receiver
        em['Subject'] = subject
        em.set_content(body)

        # Add SSL (layer of security)
        context = ssl.create_default_context()

        # Log in and send the email
        with smtplib.SMTP_SSL(self.smtp_server, self.port, context=context) as smtp:
            smtp.login(self.email_sender, self.email_password)
            smtp.sendmail(self.email_sender, receiver, em.as_string())
