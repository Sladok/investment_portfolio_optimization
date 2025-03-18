from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
import uvicorn
from backend.app.routers import data, ws_stock
from fastapi.middleware.cors import CORSMiddleware
from backend.app.routers import auth
from backend.app.routers.admin_clickhouse import router as admin_router


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(data.router)
app.include_router(ws_stock.router)
app.include_router(auth.router)
app.include_router(admin_router)
@app.get("/")
def root():
    return {"message": "Welcome to Investment Portfolio Optimization API"}


if __name__ == "__main__":
    uvicorn.run("main:app", reload=True)