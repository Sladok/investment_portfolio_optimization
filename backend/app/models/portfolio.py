from pydantic import BaseModel, Field
from typing import List, Optional
from uuid import UUID
from datetime import datetime

class Stock(BaseModel):
    ticker: str
    allocation: float = Field(..., ge=0, le=100)  # Процент от 0 до 100

class PortfolioCreate(BaseModel):
    name: str
    stocks: List[Stock]

class PortfolioUpdate(BaseModel):
    name: Optional[str] = None
    stocks: Optional[List[Stock]] = None

class PortfolioResponse(BaseModel):
    id: UUID
    user_email: str
    name: str
    stocks: List[Stock]
    created_at: datetime
    updated_at: datetime


# from pydantic import BaseModel
# from typing import List, Optional


# class PortfolioCreate(BaseModel):
#     name: str
#     stocks: List[str]  # Список тикеров акций


# class PortfolioUpdate(BaseModel):
#     name: Optional[str] = None  # Имя может быть пустым
#     stocks: Optional[List[str]] = None  # Список тикеров акций может быть пустым


# class PortfolioResponse(BaseModel):
#     id: str
#     name: str
#     stocks: List[str]  # Список тикеров акций
#     user_email: str


# from pydantic import BaseModel
# from typing import List


# class PortfolioCreate(BaseModel):
#     name: str
#     stocks: List[str]


# class PortfolioUpdate(BaseModel):
#     name: str | None = None
#     stocks: List[str] | None = None


# class PortfolioResponse(BaseModel):
#     id: str
#     name: str
#     stocks: List[str]
#     user_email: str