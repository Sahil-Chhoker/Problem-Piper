
from fastapi import APIRouter
from send_emails import scheduler, configure_email_sending_time

router = APIRouter()

@router.on_event("startup")
async def startup_event():
    configure_email_sending_time()  
    scheduler.start()
    print("Scheduler started successfully")

@router.on_event("shutdown")
async def shutdown_event():
    scheduler.shutdown()
    print("Scheduler shut down successfully")
