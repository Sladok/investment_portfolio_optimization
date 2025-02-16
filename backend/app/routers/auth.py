from fastapi import APIRouter, HTTPException, Depends, status
from backend.app.models import user as schemas
from backend.app.utils import auth
from backend.app.utils.database import users_db

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=schemas.Token)
def register(user: schemas.UserCreate):
    if user.email in users_db:
        raise HTTPException(status_code=400, detail="Пользователь уже существует")
    hashed_password = auth.get_password_hash(user.password)
    users_db[user.email] = {"email": user.email, "hashed_password": hashed_password}
    access_token = auth.create_access_token(data={"sub": user.email})
    return {"access_token": access_token}

@router.post("/login", response_model=schemas.Token)
def login(user: schemas.UserLogin):
    db_user = users_db.get(user.email)
    if not db_user or not auth.verify_password(user.password, db_user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Неверный email или пароль",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = auth.create_access_token(data={"sub": user.email})
    return {"access_token": access_token}
