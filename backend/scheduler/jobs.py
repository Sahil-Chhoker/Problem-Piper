from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
from sqlalchemy.orm import Session
from emails.base import EmailSender
from db.repository.questions import get_a_random_question
from db.models.user import User

scheduler = BackgroundScheduler()

def send_daily_emails(user: User, db: Session):
    if user and user.is_subscribed:
        email_sender = EmailSender()

        json_question = get_a_random_question(db=db)

        receiver = user.email
        subject = f"Can you solve {json_question.name}?"

        body = f"Your daily question:\n\n{json_question.preview}\n\nRegards,\n\nQuestion Bot"
        email_sender.send_email(receiver=receiver, subject=subject, body=body)

def schedule_email_job(user: User, db: Session):
    scheduler.add_job(send_daily_emails, CronTrigger(hour=17, minute=35), args=[user, db], id=str(user.id))

def unschedule_email_job(user: User):
    scheduler.remove_job(str(user.id))

def start_scheduler():
    scheduler.start()
