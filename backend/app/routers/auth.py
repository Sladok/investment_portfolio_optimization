from fastapi import APIRouter, HTTPException, status
from backend.app.models import user as schemas
from backend.app.utils.user_manager import UserManager

router = APIRouter(prefix="/auth", tags=["auth"])
user_manager = UserManager()


@router.post("/register", response_model=schemas.Token)
def register(user: schemas.UserCreate):
    try:
        access_token = user_manager.register_user(user.email, user.password)
        return {"access_token": access_token}
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/login", response_model=schemas.Token)
def login(user: schemas.UserLogin):
    try:
        access_token = user_manager.authenticate_user(user.email, user.password)
        return {"access_token": access_token}
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/delete-account")
def delete_account(user: schemas.UserDelete):
    try:
        return user_manager.delete_user(user.email)
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))