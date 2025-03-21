from fastapi import APIRouter, Depends, HTTPException
from backend.app.models.portfolio import PortfolioCreate, PortfolioUpdate, PortfolioResponse
from backend.app.utils.auth_manager import AuthManager
from backend.app.utils.database import ClickHouseDB
from typing import List

router = APIRouter()
db = ClickHouseDB()

auth_manager = AuthManager()
get_current_user = auth_manager.get_current_user  # Функция для получения пользователя


@router.post("/portfolios/", response_model=dict)
def create_portfolio(data: PortfolioCreate, user_email: str = Depends(get_current_user)):
    try:
        db.create_portfolio(user_email, data.name, data.stocks)
        return {"message": "Портфель создан"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/portfolios/", response_model=List[PortfolioResponse])
def get_portfolios(user_email: str = Depends(get_current_user)):
    try:
        return db.get_portfolios(user_email)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/portfolios/{portfolio_id}/", response_model=dict)
def update_portfolio(
    portfolio_id: str, data: PortfolioUpdate, user_email: str = Depends(get_current_user)
):
    try:
        db.update_portfolio(user_email, portfolio_id, data.name, data.stocks)
        return {"message": "Портфель обновлён"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/portfolios/{portfolio_id}/", response_model=dict)
def delete_portfolio(portfolio_id: str, user_email: str = Depends(get_current_user)):
    try:
        db.delete_portfolio(user_email, portfolio_id)
        return {"message": "Портфель удалён"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
    

# from fastapi import APIRouter, Depends, HTTPException
# from backend.app.utils.database import ClickHouseDB
# from backend.app.utils.auth_manager import AuthManager
# from pydantic import BaseModel, Field
# from typing import List

# auth_manager = AuthManager()
# get_current_user = auth_manager.get_current_user  # Функция для получения пользователя

# router = APIRouter()
# db = ClickHouseDB()

# class PortfolioCreateRequest(BaseModel):
#     name: str
#     stocks: List[str]

# @router.post("/portfolios/", response_model=dict)
# def create_portfolio(data: PortfolioCreateRequest, user_email: str = Depends(get_current_user)):
#     """Создает новый портфель для пользователя"""
#     try:
#         db.create_portfolio(user_email, data.name, data.stocks)
#         return {"message": "Портфель создан"}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))

# @router.get("/portfolios/", response_model=List[dict])
# def get_portfolios(user_email: str = Depends(get_current_user)):
#     """Получает список всех портфелей пользователя"""
#     try:
#         return db.get_portfolios(user_email)
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))

# class PortfolioUpdateRequest(BaseModel):
#     name: str | None = Field(None, description="Новое имя портфеля")
#     stocks: List[str] | None = Field(None, description="Новый список акций")

# @router.put("/portfolios/{portfolio_id}/", response_model=dict)
# def update_portfolio(
#     portfolio_id: str, 
#     data: PortfolioUpdateRequest, 
#     user_email: str = Depends(get_current_user)
# ):
#     """Обновляет портфель пользователя"""
#     try:
#         db.update_portfolio(user_email, portfolio_id, data.name, data.stocks)
#         return {"message": "Портфель обновлён"}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))