import os

from dotenv import load_dotenv

load_dotenv()


class Settings:
    PROJECT_NAME: str = "Problem Piper"
    PROJECT_VERSION: str = "2.0.0"

    DATABASE_URL = os.getenv("DATABASE_URL")
    SECRET_KEY: str = os.getenv("SECRET_KEY")
    ALGORITHM = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES = 30

    SENDER_EMAIL = os.getenv("SENDER_EMAIL")
    EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")


settings = Settings()
