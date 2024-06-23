from db.models.user import User
from sqlalchemy.orm import Session


def subscribe_to_service(user: User, db: Session):
    if user.is_subscribed:
        return {"message": "Already subscribed"}
    user.is_subscribed = True
    db.commit()
    db.refresh(user)
    return {"message": "successfully subscribed"}

def unsubscribe_to_service(user: User, db: Session):
    if not user.is_subscribed:
        return {"message": "Please subscribe first to unsubscribe"}
    user.is_subscribed = False
    db.commit()
    db.refresh(user)
    return {"message": "successfully unsubscribed"}