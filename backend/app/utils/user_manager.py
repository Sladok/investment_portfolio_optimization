from fastapi import HTTPException, status
from backend.app.utils.database import ClickHouseDB
from backend.app.utils.auth_manager import AuthManager


class UserManager:
    def __init__(self):
        self.db = ClickHouseDB()
        self.auth = AuthManager()

    def register_user(self, email: str, password: str) -> str:
        if self.db.get_user_by_email(email):
            raise HTTPException(status_code=400, detail="Пользователь уже существует")
        hashed_password = self.auth.get_password_hash(password)
        self.db.create_user(email, hashed_password)
        return self.auth.create_access_token(data={"sub": email})

    def authenticate_user(self, email: str, password: str) -> str:
        hashed_password = self.db.get_user_by_email(email)
        if not hashed_password or not self.auth.verify_password(password, hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Неверный email или пароль",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return self.auth.create_access_token(data={"sub": email})

    def delete_user(self, email: str):
        return self.db.delete_user(email)
