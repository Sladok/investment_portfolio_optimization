from fastapi import APIRouter, Depends, HTTPException
from backend.app.models.portfolio import PortfolioCreate, PortfolioUpdate, PortfolioResponse
from backend.app.utils.auth_manager import AuthManager
from backend.app.utils.database import ClickHouseDB
from typing import List

router = APIRouter()
db = ClickHouseDB()
auth_manager = AuthManager()
get_current_user = auth_manager.get_current_user

@router.post("/portfolios/", response_model=dict)
def create_portfolio(data: PortfolioCreate, user_email: str = Depends(get_current_user)):
    try:
        db.create_portfolio(user_email, data.name, data.stocks)
        return {"message": "Портфель создан"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/portfolios/", response_model=List[PortfolioResponse])
def get_user_portfolios(user_email: str = Depends(get_current_user)):
    try:
        return db.get_user_portfolios(user_email)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/portfolios/{portfolio_id}/", response_model=PortfolioResponse)
def get_portfolio(portfolio_id: str, user_email: str = Depends(get_current_user)):
    try:
        portfolio = db.get_portfolio_by_id(user_email, portfolio_id)
        if portfolio:
            return portfolio
        raise HTTPException(status_code=404, detail="Портфель не найден")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/portfolios/{portfolio_id}/", response_model=dict)
def update_portfolio(portfolio_id: str, data: PortfolioUpdate, user_email: str = Depends(get_current_user)):
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
    
@router.get("/all-portfolios/", response_model=List[PortfolioResponse])
def get_all_portfolios():
    try:
        return db.get_all_portfolios()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# from fastapi import APIRouter, Depends, HTTPException
# from backend.app.models.portfolio import PortfolioCreate, PortfolioUpdate, PortfolioResponse
# from backend.app.utils.auth_manager import AuthManager
# from backend.app.utils.database import ClickHouseDB
# from typing import List

# router = APIRouter()
# db = ClickHouseDB()
# auth_manager = AuthManager()
# get_current_user = auth_manager.get_current_user


# @router.post("/portfolios/", response_model=dict)
# def create_portfolio(data: PortfolioCreate, user_email: str = Depends(get_current_user)):
#     try:
#         db.create_portfolio(user_email, data.name, data.stocks)
#         return {"message": "Портфель создан"}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))


# @router.get("/portfolios/", response_model=List[PortfolioResponse])
# def get_user_portfolios(user_email: str = Depends(get_current_user)):
#     try:
#         return db.get_user_portfolios(user_email)
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))


# @router.get("/portfolios/{portfolio_id}/", response_model=PortfolioResponse)
# def get_portfolio(portfolio_id: str, user_email: str = Depends(get_current_user)):
#     try:
#         portfolio = db.get_portfolio_by_id(user_email, portfolio_id)
#         if portfolio:
#             return portfolio
#         raise HTTPException(status_code=404, detail="Портфель не найден")
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))


# @router.put("/portfolios/{portfolio_id}/", response_model=dict)
# def update_portfolio(portfolio_id: str, data: PortfolioUpdate, user_email: str = Depends(get_current_user)):
#     try:
#         db.update_portfolio(user_email, portfolio_id, data.name, data.stocks)
#         return {"message": "Портфель обновлён"}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))


# @router.delete("/portfolios/{portfolio_id}/", response_model=dict)
# def delete_portfolio(portfolio_id: str, user_email: str = Depends(get_current_user)):
#     try:
#         db.delete_portfolio(user_email, portfolio_id)
#         return {"message": "Портфель удалён"}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))



# from fastapi import APIRouter, Depends, HTTPException
# from backend.app.models.portfolio import PortfolioCreate, PortfolioUpdate, PortfolioResponse
# from backend.app.utils.auth_manager import AuthManager
# from backend.app.utils.database import ClickHouseDB
# from typing import List

# router = APIRouter()
# db = ClickHouseDB()

# auth_manager = AuthManager()
# get_current_user = auth_manager.get_current_user  # Функция для получения пользователя


# @router.post("/portfolios/", response_model=dict)
# def create_portfolio(data: PortfolioCreate, user_email: str = Depends(get_current_user)):
#     try:
#         db.create_portfolio(user_email, data.name, data.stocks)
#         return {"message": "Портфель создан"}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))


# @router.get("/portfolios/", response_model=List[PortfolioResponse])
# def get_user_portfolios(user_email: str = Depends(get_current_user)):
#     try:
#         return db.get_user_portfolios(user_email)
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))


# @router.get("/all-portfolios/", response_model=List[PortfolioResponse])
# def get_all_portfolios(user_email: str = Depends(get_current_user)):
#     try:
#         return db.get_all_portfolios()
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))


# @router.put("/portfolios/{portfolio_id}/", response_model=dict)
# def update_portfolio(
#     portfolio_id: str, data: PortfolioUpdate, user_email: str = Depends(get_current_user)
# ):
#     try:
#         db.update_portfolio(user_email, portfolio_id, data.name, data.stocks)
#         return {"message": "Портфель обновлён"}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))

# @router.delete("/portfolios/{portfolio_id}/", response_model=dict)
# def delete_portfolio(portfolio_id: str, user_email: str = Depends(get_current_user)):
#     try:
#         db.delete_portfolio(user_email, portfolio_id)
#         return {"message": "Портфель удалён"}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))
    

# @router.get("/portfolios/{portfolio_id}/", response_model=PortfolioResponse)
# def get_portfolio(portfolio_id: str, user_email: str = Depends(get_current_user)):
#     # print(f"🔹 Получен email: {user_email}")  # Отладочный вывод
#     try:
#         portfolio = db.get_portfolio_by_id(user_email, portfolio_id)
#         if portfolio:
#             return portfolio
#         raise HTTPException(status_code=404, detail="Портфель не найден")
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))