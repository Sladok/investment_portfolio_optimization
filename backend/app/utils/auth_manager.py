from passlib.context import CryptContext
from fastapi import Depends, HTTPException, Security
from datetime import datetime, timedelta
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
import os
from dotenv import load_dotenv

load_dotenv()
SECRET_KEY, ALGORITHM = os.getenv("SECRET_KEY"), os.getenv("ALGORITHM") 
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

class AuthManager:
    def __init__(self, secret_key=SECRET_KEY, algorithm=ALGORITHM, expire_minutes=30):
        self.pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
        self.secret_key = secret_key
        self.algorithm = algorithm
        self.expire_minutes = expire_minutes

    def get_password_hash(self, password: str) -> str:
        return self.pwd_context.hash(password)

    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        return self.pwd_context.verify(plain_password, hashed_password)

    def create_access_token(self, data: dict, expires_delta: timedelta = None) -> str:
        to_encode = data.copy()
        expire = datetime.utcnow() + (expires_delta or timedelta(minutes=self.expire_minutes))
        to_encode.update({"exp": expire})
        return jwt.encode(to_encode, self.secret_key, algorithm=self.algorithm)

    def decode_access_token(self, token: str):
        try:
            return jwt.decode(token, self.secret_key, algorithms=[self.algorithm])
        except JWTError:
            return None
    
    def get_current_user(self, token: str = Security(oauth2_scheme)):
        """Декодирует токен и возвращает email пользователя"""
        payload = self.decode_access_token(token)
        if not payload or "sub" not in payload:
            raise HTTPException(
                status_code=401, detail="Не удалось проверить учетные данные"
            )
        return payload["sub"]