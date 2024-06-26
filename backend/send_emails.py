import smtplib
import ssl
from email.message import EmailMessage
import time
from fastapi import APIRouter, HTTPException
from apscheduler.schedulers.background import BackgroundScheduler
from db.models.user import User
from db.session import SessionLocal
from core.config import settings
from db.repository.questions import get_a_random_question
from schemas.questions import Question

class EmailSender:
    def __init__(self):
        self.email_sender = settings.SENDER_EMAIL
        self.email_password = settings.EMAIL_PASSWORD
        self.smtp_server = 'smtp.gmail.com'
        self.port = 465

        if not self.email_password:
            raise ValueError("Email password not found in environment variables.")

    def send_email(self, receiver: str, subject: str, body: str):
        try:
            em = EmailMessage()
            em['From'] = self.email_sender
            em['To'] = receiver
            em['Subject'] = subject
            em.set_content(body)

            context = ssl.create_default_context()
            with smtplib.SMTP_SSL(self.smtp_server, self.port, context=context) as smtp:
                smtp.login(self.email_sender, self.email_password)
                smtp.sendmail(self.email_sender, receiver, em.as_string())
        except Exception as e:
            if isinstance(e, OSError) and e.errno == 10060:
                time.sleep(5)
                self.send_email(receiver, subject, body)
            else:
                raise HTTPException(status_code=500, detail="Failed to send email.")

router = APIRouter()
email_sender = EmailSender()

def send_email_to_subscribers():
    db = SessionLocal()
    
    question = get_a_random_question(db)
    if not question:
        raise HTTPException(status_code=500, detail="Failed to fetch question.")
    question_data = Question.from_orm(question)

    subject = "Today's Question"
    body = f"""
        <html>
            <head>
                <style>
                    body {{
                        font-family: Arial, sans-serif;
                        line-height: 1.6;
                    }}
                    .question {{
                        font-size: 1.2em;
                        font-weight: bold;
                        margin-bottom: 10px;
                    }}
                    .preview {{
                        font-style: italic;
                        margin-bottom: 10px;
                    }}
                    .details {{
                        margin-bottom: 10px;
                    }}
                    .link {{
                        color: #007bff;
                        text-decoration: none;
                    }}
                </style>
            </head>
            <body>
                <div class="question">
                    Question: {question_data.name}
                </div>
                <div class="preview">
                    Preview: {question_data.preview}
                </div>
                <div class="details">
                    <p>Difficulty: {question_data.difficulty_name}</p>
                    <p>Max Score: {question_data.max_score}</p>
                    <p>Success Ratio: {question_data.success_ratio}</p>
                    <p>Link: <a class="link" href="{question_data.link}" target="_blank">{question_data.link}</a></p>
                </div>
            </body>
        </html>
    """

    try:
        subscribers = db.query(User).filter(User.is_subscribed == True).all()
        for subscriber in subscribers:
            email_sender.send_email(subscriber.email, subject, body)
    finally:
        db.close()

scheduler = BackgroundScheduler()
scheduler.add_job(send_email_to_subscribers, 'interval', seconds=30)

@router.on_event("startup")
async def startup_event():
    scheduler.start()

@router.on_event("shutdown")
async def shutdown_event():
    scheduler.shutdown()
