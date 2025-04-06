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