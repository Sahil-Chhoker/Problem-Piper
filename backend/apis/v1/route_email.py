from fastapi import APIRouter
from send_emails import configure_email_sending_time, scheduler
router = APIRouter()

@router.post("/set_email_time")
async def set_email_time(hour: int, minute: int):
    configure_email_sending_time(hour, minute)
    return {"message": f"Emails will now be sent daily at {hour}:{minute} IST."}


@router.on_event("startup")
async def startup_event():
    scheduler.start()


@router.on_event("shutdown")
async def shutdown_event():
    scheduler.shutdown()
    