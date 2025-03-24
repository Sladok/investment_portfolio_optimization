from pydantic import BaseModel
from typing import List


class PortfolioCreate(BaseModel):
    name: str
    stocks: List[str]


class PortfolioUpdate(BaseModel):
    name: str | None = None
    stocks: List[str] | None = None


class PortfolioResponse(BaseModel):
    id: str
    name: str
    stocks: List[str]
    user_email: str