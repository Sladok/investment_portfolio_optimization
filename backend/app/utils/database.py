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

    def get_user_portfolios(self, user_email: str):
        """Получает список всех портфелей пользователя"""
        self._ensure_connection()
        query = "SELECT id, name, stocks, user_email FROM portfolios WHERE user_email = %(user_email)s"
        result = self.client.query(query, {"user_email": user_email}).result_rows
        return [{"id": str(row[0]), "name": row[1], "stocks": row[2], "user_email": row[3]} for row in result]

    def get_all_portfolios(self):
        """Получает список всех портфелей пользователя"""
        self._ensure_connection()
        query = "SELECT id, name, stocks, user_email FROM portfolios"
        result = self.client.query(query).result_rows
        return [{"id": str(row[0]), "name": row[1], "stocks": row[2], "user_email": row[3]} for row in result]

    def update_portfolio(self, user_email: str, portfolio_id: str, name: str | None, stocks: List[str] | None):
        self._ensure_connection()
    
        # Проверяем, есть ли портфель у пользователя
        query_check = "SELECT count() FROM portfolios WHERE id = %(id)s AND user_email = %(user_email)s"
        existing = self.client.query(query_check, {"id": portfolio_id, "user_email": user_email}).result_rows[0][0]
        
        if existing == 0:
            raise Exception("Портфель не найден или не принадлежит пользователю")
    
        # Удаляем старую запись
        query_delete = "ALTER TABLE portfolios DELETE WHERE id = %(id)s AND user_email = %(user_email)s"
        self.client.command(query_delete, {"id": portfolio_id, "user_email": user_email})
    
        # Вставляем обновленные данные
        query_insert = """
        INSERT INTO portfolios (id, name, stocks, user_email) 
        VALUES (%(id)s, %(name)s, %(stocks)s, %(user_email)s)
        """
    
        params = {
            "id": portfolio_id,
            "user_email": user_email,
            "name": name if name else "(SELECT name FROM portfolios WHERE id = %(id)s AND user_email = %(user_email)s)",
            "stocks": stocks if stocks else "(SELECT stocks FROM portfolios WHERE id = %(id)s AND user_email = %(user_email)s)",
        }
    
        self.client.command(query_insert, params)



    def get_portfolio_by_id(self, user_email: str, portfolio_id: str):
        """Получает один портфель по его ID"""
        self._ensure_connection()

        print(f"🔹 SQL-запрос: SELECT id, name, stocks FROM portfolios WHERE user_email = {user_email} AND id = {portfolio_id}")

        query = "SELECT id, name, stocks FROM portfolios WHERE user_email = %(user_email)s AND id = %(portfolio_id)s"
        result = self.client.query(query, {"user_email": user_email, "portfolio_id": portfolio_id}).result_rows

        print(f"🔹 Результат запроса: {result}")

        if result:
            return {
                "id": str(result[0][0]),
                "name": result[0][1],
                "stocks": result[0][2],
                "user_email": user_email
            }

        return None


    def delete_portfolio(self, user_email: str, portfolio_id: str):
        self._ensure_connection()

        query = "SELECT count() FROM portfolios WHERE id = %(id)s AND user_email = %(user_email)s"
        existing = self.client.query(query, {"id": portfolio_id, "user_email": user_email}).result_rows[0][0]
        if existing == 0:
            raise Exception("Портфель не найден или не принадлежит пользователю")

        delete_query = "ALTER TABLE portfolios DELETE WHERE id = %(id)s AND user_email = %(user_email)s"
        self.client.command(delete_query, {"id": portfolio_id, "user_email": user_email})


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