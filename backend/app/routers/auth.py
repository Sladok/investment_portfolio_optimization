from fastapi import APIRouter, HTTPException, Depends, status
from backend.app.models import user as schemas
from backend.app.utils import auth
import clickhouse_connect


client = clickhouse_connect.get_client(host="localhost", port=8123)

router = APIRouter(prefix="/auth", tags=["auth"])

# Создание таблицы пользователей, если её нет
client.query('''
    CREATE TABLE IF NOT EXISTS users (
        id UUID DEFAULT generateUUIDv4(),
        email String,
        hashed_password String
    ) ENGINE = ReplacingMergeTree()
    ORDER BY email
''')

@router.post("/register", response_model=schemas.Token)
def register(user: schemas.UserCreate):
    # Проверка, есть ли уже такой email
    existing = client.query(f"SELECT count() FROM users WHERE email = '{user.email}'").result_rows[0][0]
    if existing > 0:
        raise HTTPException(status_code=400, detail="Пользователь уже существует")

    # Хеширование пароля
    hashed_password = auth.get_password_hash(user.password)

    # Добавление в базу
    client.query(f"INSERT INTO users (email, hashed_password) VALUES ('{user.email}', '{hashed_password}')")

    # Генерация access_token
    access_token = auth.create_access_token(data={"sub": user.email})
    return {"access_token": access_token}

@router.post("/login", response_model=schemas.Token)
def login(user: schemas.UserLogin):
    # Получение пользователя из базы
    result = client.query(f"SELECT hashed_password FROM users WHERE email = '{user.email}'").result_rows
    if not result:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Неверный email или пароль",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Проверка пароля
    hashed_password = result[0][0]
    if not auth.verify_password(user.password, hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Неверный email или пароль",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Генерация токена
    access_token = auth.create_access_token(data={"sub": user.email})
    return {"access_token": access_token}


# @router.post("/register", response_model=schemas.Token)
# def register(user: schemas.UserCreate):
#     if user.email in users_db:
#         raise HTTPException(status_code=400, detail="Пользователь уже существует")
#     hashed_password = auth.get_password_hash(user.password)
#     users_db[user.email] = {"email": user.email, "hashed_password": hashed_password}
#     access_token = auth.create_access_token(data={"sub": user.email})
#     return {"access_token": access_token}

# @router.post("/login", response_model=schemas.Token)
# def login(user: schemas.UserLogin):
#     db_user = users_db.get(user.email)
#     if not db_user or not auth.verify_password(user.password, db_user["hashed_password"]):
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED,
#             detail="Неверный email или пароль",
#             headers={"WWW-Authenticate": "Bearer"},
#         )
#     access_token = auth.create_access_token(data={"sub": user.email})
#     return {"access_token": access_token}
