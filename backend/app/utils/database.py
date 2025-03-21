import clickhouse_connect
import json
from datetime import datetime
from typing import List

class ClickHouseDB:
    def __init__(self, host="localhost", port=8123):
        self._host = host
        self._port = port
        self.client = None
        self._connect = False  # Теперь атрибут всегда существует
        self._try_connect()

    def _try_connect(self):
        """Пытается подключиться к ClickHouse, возвращает True при успехе."""
        if self.client:
            return True  # Уже подключено

        try:
            self.client = clickhouse_connect.get_client(host=self._host, port=self._port)
            self._connect = True
            self._create_tables()  # Создаем таблицы только после успешного соединения
            return True
        except Exception as ex:
            print(f"Ошибка подключения к ClickHouse: {ex}")
            self.client = None
            self._connect = False
            return False

    
    def _ensure_connection(self):
        """Проверяет подключение, если сломано — перезапускает."""
        if not self._connect:
            self._connect = self._try_connect()
        if not self._connect:
            raise Exception("Ошибка сервера: нет соединения с ClickHouse")

    def _create_tables(self):
        """Создает таблицы, если их нет."""
        if not self._connect:
            return
        self.client.command('''
            CREATE TABLE IF NOT EXISTS users (
                id UUID DEFAULT generateUUIDv4(),
                email String,
                hashed_password String
            ) ENGINE = ReplacingMergeTree()
            ORDER BY email
        ''')

        self.client.command('''
            CREATE TABLE IF NOT EXISTS portfolios (
                id UUID DEFAULT generateUUIDv4(),
                user_email String,
                name String,
                stocks Array(String)
            ) ENGINE = ReplacingMergeTree()
            ORDER BY (user_email, name)
        ''')

    def _delete_tables(self, name: str):
        """Удаляет таблицу с заданным именем"""
        self._ensure_connection()
        try:
            query = f"DROP TABLE IF EXISTS {name}"
            self.client.command(query)
            print(f"Таблица {name} успешно удалена.")
        except Exception as e:
            print(f"Ошибка при удалении таблицы {name}: {e}")

    def create_portfolio(self, user_email: str, name: str, stocks: list):
        self._ensure_connection()
        query = "INSERT INTO portfolios (user_email, name, stocks) VALUES (%(user_email)s, %(name)s, %(stocks)s)"
        self.client.command(query, {"user_email": user_email, "name": name, "stocks": stocks})


    def get_portfolios(self, user_email: str):
        """Получает список всех портфелей пользователя"""
        self._ensure_connection()
        query = "SELECT name, stocks FROM portfolios WHERE user_email = %(user_email)s"
        result = self.client.query(query, {"user_email": user_email}).result_rows
        return [{"name": row[0], "stocks": row[1]} for row in result]

    def update_portfolio(self, user_email: str, portfolio_id: str, new_name: str = None, new_stocks: List[str] = None):
        """Обновляет портфель пользователя"""
        self._ensure_connection()

        if not new_name and not new_stocks:
            raise ValueError("Нужно указать хотя бы одно изменение (имя или акции).")

        query_parts = []
        params = {"email": user_email, "id": portfolio_id}

        if new_name:
            query_parts.append("name = %(name)s")
            params["name"] = new_name

        if new_stocks:
            query_parts.append("stocks = %(stocks)s")
            params["stocks"] = ",".join(new_stocks)

        query = f"ALTER TABLE portfolios UPDATE {', '.join(query_parts)} WHERE user_email = %(email)s AND id = %(id)s"

        self.client.command(query, params)

    def get_user_by_email(self, email: str):
        self._ensure_connection()
        query = "SELECT hashed_password FROM users WHERE email = %(email)s"
        result = self.client.query(query, {"email": email}).result_rows
        return result[0][0] if result else None

    def create_user(self, email: str, hashed_password: str):
        self._ensure_connection()

        query = "SELECT count() FROM users WHERE email = %(email)s"
        existing = self.client.query(query, {"email": email}).result_rows[0][0]
        if existing > 0:
            raise Exception("Пользователь уже существует")

        insert_query = "INSERT INTO users (email, hashed_password) VALUES (%(email)s, %(password)s)"
        self.client.command(insert_query, {"email": email, "password": hashed_password})

    def delete_user(self, email: str):
        self._ensure_connection()

        query = "SELECT count() FROM users WHERE email = %(email)s"
        existing = self.client.query(query, {"email": email}).result_rows[0][0]
        if existing == 0:
            raise Exception("Пользователь не найден")

        delete_query = "ALTER TABLE users DELETE WHERE email = %(email)s"
        self.client.command(delete_query, {"email": email})

        return {"message": "Аккаунт успешно удалён"}
    


# bd = ClickHouseDB()
# bd._delete_tables("portfolios")