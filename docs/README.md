# AI Invest Navigator

## 📌 Описание проекта
**AI Invest Navigator** — это веб-приложение для автоматизированного управления инвестиционным портфелем. Оно анализирует рыночные данные, предлагает оптимальные стратегии и помогает пользователям принимать обоснованные инвестиционные решения.

## 🚀 Основные возможности
- **Регистрация и авторизация пользователей** (обычные, VIP и Premium-аккаунты)
- **Формирование инвестиционного портфеля** на основе пользовательских предпочтений
- **Парсинг рыночных данных** (акции, индексы, новости)
- **Оптимизация портфеля с помощью машинного обучения**
- **Анализ новостей с помощью NLP**
- **Графики и визуализация данных** в реальном времени

## 🔧 Технологии
### **Backend** (FastAPI):
- **Python 3.10+**
- **FastAPI** (основной веб-фреймворк)
- **ClickHouse** (база данных)
- **yFinance / Alpha Vantage API** (данные о фондовом рынке)
- **Pydantic / SQLAlchemy** (работа с данными)

### **Frontend** (React):
- **React.js** (основной фреймворк)
- **Recharts** (графики)
- **Axios** (HTTP-запросы к API)
- **Tailwind CSS** (стилизация)

## 📂 Структура проекта
```
investment_portfolio_optimization/
├── backend/                    # Серверная часть (FastAPI)
│   ├── app/
│   │   ├── main.py             # Главная точка входа FastAPI
│   │   ├── models/             # Модели Pydantic и SQLAlchemy
│   │   ├── routers/            # API-эндпоинты
│   │   ├── services/           # ML, парсинг, NLP
│   │   ├── utils/              # Вспомогательные функции
│   ├── tests/                  # Юнит-тесты
│   └── requirements.txt        # Зависимости Python
├── frontend/                   # Клиентская часть (React)
│   ├── src/
│   │   ├── components/         # UI-компоненты
│   │   ├── pages/              # Страницы приложения
│   │   ├── App.jsx             # Главный компонент
│   │   ├── index.js            # Точка входа
│   ├── package.json            # Зависимости React
├── data/                       # Данные для анализа
├── docs/                       # Документация проекта
├── .gitignore                  # Игнорируемые файлы
├── README.md                   # Вы здесь
└── LICENSE                     # Лицензия проекта
```

## 🛠 Установка и запуск
### **1️⃣ Клонирование репозитория**
```bash
git clone https://github.com/Sladok/investment_portfolio_optimization.git
cd investment_portfolio_optimization
```
### **2️⃣ Настройка Backend**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # (Windows: venv\Scripts\activate)
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### **3️⃣ Настройка Frontend**
```bash
cd frontend
npm install
npm start
```

### **4️⃣ Запуск ClickHouse** (если установлен локально)
```bash
clickhouse-server start
```

## 📡 API Документация
После запуска FastAPI, документация доступна по адресу:
- Swagger UI: [http://localhost:8000/docs](http://localhost:8000/docs)
- Redoc: [http://localhost:8000/redoc](http://localhost:8000/redoc)

## 📜 Лицензия
Этот проект распространяется под лицензией **Apache License 2.0**.

---
🎯 **Автор:** *Александр / Sladok*

