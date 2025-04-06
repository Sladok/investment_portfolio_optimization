import clickhouse_connect
import json
from datetime import datetime
from typing import List, Dict

class ClickHouseDB:
    def __init__(self, host="localhost", port=8123):
        self._host = host
        self._port = port
        self.client = None
        self._connect = False
        self._try_connect()

    def _try_connect(self):
        try:
            self.client = clickhouse_connect.get_client(host=self._host, port=self._port)
            self._connect = True
            self._create_tables()
            return True
        except Exception as ex:
            print(f"Ошибка подключения к ClickHouse: {ex}")
            self.client = None
            self._connect = False
            return False

    def _ensure_connection(self):
        if not self._connect:
            self._connect = self._try_connect()
        if not self._connect:
            raise Exception("Ошибка сервера: нет соединения с ClickHouse")

    def _create_tables(self):
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
                created_at DateTime DEFAULT now(),
                updated_at DateTime DEFAULT now()
            ) ENGINE = ReplacingMergeTree()
            ORDER BY (user_email, name)
        ''')

        self.client.command('''
            CREATE TABLE IF NOT EXISTS portfolio_stocks (
                portfolio_id UUID,
                ticker String,
                allocation Float32
            ) ENGINE = ReplacingMergeTree()
            ORDER BY (portfolio_id, ticker)
        ''')

    def _delete_tables(self, name: str):
        self._ensure_connection()
        try:
            query = f"DROP TABLE IF EXISTS {name}"
            self.client.command(query)
            print(f"Таблица {name} успешно удалена.")
        except Exception as e:
            print(f"Ошибка при удалении таблицы {name}: {e}")

    def create_portfolio(self, user_email: str, name: str, stocks: List):
        self._ensure_connection()
        portfolio_id = self.client.query("SELECT generateUUIDv4()").result_rows[0][0]
    
        self.client.command('''
            INSERT INTO portfolios (id, user_email, name)
            VALUES (%(id)s, %(user_email)s, %(name)s)
        ''', {"id": portfolio_id, "user_email": user_email, "name": name})
    
        for stock in stocks:
            # Используем доступ через атрибуты, т.к. stock — это объект модели Stock.
            self.client.command('''
                INSERT INTO portfolio_stocks (portfolio_id, ticker, allocation)
                VALUES (%(portfolio_id)s, %(ticker)s, %(allocation)s)
            ''', {
                "portfolio_id": portfolio_id,
                "ticker": stock.ticker,
                "allocation": stock.allocation
            })

    def get_user_portfolios(self, user_email: str):
        self._ensure_connection()
        query = "SELECT id, name, created_at, updated_at FROM portfolios WHERE user_email = %(user_email)s"
        result = self.client.query(query, {"user_email": user_email}).result_rows

        portfolios = []
        for row in result:
            portfolio_id, name, created_at, updated_at = row

            # Получаем акции для каждого портфеля
            stocks_query = "SELECT ticker, allocation FROM portfolio_stocks WHERE portfolio_id = %(id)s"
            stocks_result = self.client.query(stocks_query, {"id": portfolio_id}).result_rows

            # Формируем список акций для портфеля
            stocks = [{"ticker": stock[0], "allocation": stock[1]} for stock in stocks_result]

            # Добавляем user_email и даты в ответ
            portfolios.append({
                "id": portfolio_id,
                "name": name,
                "created_at": created_at,
                "updated_at": updated_at,
                "stocks": stocks,
                "user_email": user_email
            })

        return portfolios

    def get_portfolio_by_id(self, user_email: str, portfolio_id: str):
        self._ensure_connection()
        query = """
            SELECT id, name, created_at, updated_at 
            FROM portfolios 
            WHERE user_email = %(user_email)s AND id = %(portfolio_id)s
        """
        result = self.client.query(query, {"user_email": user_email, "portfolio_id": portfolio_id}).result_rows
        if not result:
            return None

        portfolio_id, name, created_at, updated_at = result[0]

        stocks_query = "SELECT ticker, allocation FROM portfolio_stocks WHERE portfolio_id = %(id)s"
        stocks_result = self.client.query(stocks_query, {"id": portfolio_id}).result_rows
        stocks = [{"ticker": stock[0], "allocation": stock[1]} for stock in stocks_result]

        return {
            "id": portfolio_id,
            "name": name,
            "created_at": created_at,
            "updated_at": updated_at,
            "stocks": stocks,
            "user_email": user_email
        }


    def delete_portfolio(self, user_email: str, portfolio_id: str):
        self._ensure_connection()
        check_query = "SELECT count() FROM portfolios WHERE id = %(id)s AND user_email = %(user_email)s"
        existing = self.client.query(check_query, {"id": portfolio_id, "user_email": user_email}).result_rows[0][0]
        if existing == 0:
            raise Exception("Портфель не найден или не принадлежит пользователю")

        self.client.command("ALTER TABLE portfolios DELETE WHERE id = %(id)s", {"id": portfolio_id})
        self.client.command("ALTER TABLE portfolio_stocks DELETE WHERE portfolio_id = %(id)s", {"id": portfolio_id})

    # def update_portfolio(self, user_email: str, portfolio_id: str, name: str | None, stocks: List[str] | None):
    #     self._ensure_connection()
        
    #     # Проверяем, есть ли портфель у пользователя
    #     query_check = "SELECT count() FROM portfolios WHERE id = %(id)s AND user_email = %(user_email)s"
    #     existing = self.client.query(query_check, {"id": portfolio_id, "user_email": user_email}).result_rows[0][0]
        
    #     if existing == 0:
    #         raise Exception("Портфель не найден или не принадлежит пользователю")
        
    #     # Удаляем старую запись из таблицы portfolios (если имя портфеля меняется)
    #     if name:
    #         query_delete_name = """
    #         ALTER TABLE portfolios DELETE WHERE id = %(id)s AND user_email = %(user_email)s
    #         """
    #         self.client.command(query_delete_name, {"id": portfolio_id, "user_email": user_email})

    #         # Вставляем обновленное имя в таблицу portfolios
    #         query_insert_name = """
    #         INSERT INTO portfolios (id, name, user_email, created_at, updated_at) 
    #         VALUES (%(id)s, %(name)s, %(user_email)s, now(), now())
    #         """
    #         self.client.command(query_insert_name, {"id": portfolio_id, "name": name, "user_email": user_email})

    #     # Удаляем старые акции из таблицы portfolio_stocks
    #     query_delete_stocks = "ALTER TABLE portfolio_stocks DELETE WHERE portfolio_id = %(id)s"
    #     self.client.command(query_delete_stocks, {"id": portfolio_id})

    #     if stocks:
    #         for stock in stocks:
    #             query_insert_stock = """
    #             INSERT INTO portfolio_stocks (portfolio_id, ticker, allocation) 
    #             VALUES (%(portfolio_id)s, %(ticker)s, %(allocation)s)
    #             """
    #             self.client.command(query_insert_stock, {
    #                 "portfolio_id": portfolio_id,
    #                 "ticker": stock.ticker,  # Доступ к атрибуту ticker объекта stock
    #                 "allocation": stock.allocation  # Доступ к атрибуту allocation объекта stock
    #             })
                
    #     return {"message": "Портфель обновлён"}

    def update_portfolio(self, user_email: str, portfolio_id: str, name: str | None, stocks: List[str] | None):
        self._ensure_connection()

        # Проверяем, есть ли портфель у пользователя и получаем текущий created_at
        query_check = """
            SELECT count(), max(created_at)
            FROM portfolios
            WHERE id = %(id)s AND user_email = %(user_email)s
        """
        count, created_at = self.client.query(query_check, {"id": portfolio_id, "user_email": user_email}).result_rows[0]
        if count == 0:
            raise Exception("Портфель не найден или не принадлежит пользователю")

        # Удаляем старую запись (если имя меняется)
        if name:
            query_delete_name = """
            ALTER TABLE portfolios DELETE WHERE id = %(id)s AND user_email = %(user_email)s
            """
            self.client.command(query_delete_name, {"id": portfolio_id, "user_email": user_email})

            # Вставляем новую запись с сохранением created_at
            query_insert_name = """
            INSERT INTO portfolios (id, name, user_email, created_at, updated_at)
            VALUES (%(id)s, %(name)s, %(user_email)s, %(created_at)s, now())
            """
            self.client.command(query_insert_name, {
                "id": portfolio_id,
                "name": name,
                "user_email": user_email,
                "created_at": created_at
            })

        # Обновляем акции
        query_delete_stocks = "ALTER TABLE portfolio_stocks DELETE WHERE portfolio_id = %(id)s"
        self.client.command(query_delete_stocks, {"id": portfolio_id})

        if stocks:
            for stock in stocks:
                query_insert_stock = """
                INSERT INTO portfolio_stocks (portfolio_id, ticker, allocation)
                VALUES (%(portfolio_id)s, %(ticker)s, %(allocation)s)
                """
                self.client.command(query_insert_stock, {
                    "portfolio_id": portfolio_id,
                    "ticker": stock.ticker,
                    "allocation": stock.allocation
                })

        return {"message": "Портфель обновлён"}


    def get_all_portfolios(self):
        """Получает список всех портфелей пользователя"""
        self._ensure_connection()

        # Получаем все портфели с датами
        portfolios_query = """
            SELECT id, user_email, name, created_at, updated_at 
            FROM portfolios
        """
        portfolios = self.client.query(portfolios_query).result_rows
        print(portfolios)
        result = []
        for portfolio in portfolios:
            portfolio_id, user_email, name, created_at, updated_at = portfolio

            # Получаем акции для текущего портфеля
            stocks_query = "SELECT ticker, allocation FROM portfolio_stocks WHERE portfolio_id = %(portfolio_id)s"
            stocks = self.client.query(stocks_query, {"portfolio_id": portfolio_id}).result_rows

            # Формируем словарь портфеля
            result.append({
                "id": portfolio_id,
                "user_email": user_email,
                "name": name,
                "created_at": created_at,
                "updated_at": updated_at,
                "stocks": [{"ticker": t, "allocation": a} for t, a in stocks]
            })

        return result

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




# import clickhouse_connect
# import json
# from datetime import datetime
# from typing import List

# class ClickHouseDB:
#     def __init__(self, host="localhost", port=8123):
#         self._host = host
#         self._port = port
#         self.client = None
#         self._connect = False  # Теперь атрибут всегда существует
#         self._try_connect()

#     def _try_connect(self):
#         """Пытается подключиться к ClickHouse, возвращает True при успехе."""
#         if self.client:
#             return True  # Уже подключено

#         try:
#             self.client = clickhouse_connect.get_client(host=self._host, port=self._port)
#             self._connect = True
#             self._create_tables()  # Создаем таблицы только после успешного соединения
#             return True
#         except Exception as ex:
#             print(f"Ошибка подключения к ClickHouse: {ex}")
#             self.client = None
#             self._connect = False
#             return False

    
#     def _ensure_connection(self):
#         """Проверяет подключение, если сломано — перезапускает."""
#         if not self._connect:
#             self._connect = self._try_connect()
#         if not self._connect:
#             raise Exception("Ошибка сервера: нет соединения с ClickHouse")

#     def _create_tables(self):
#         """Создает таблицы, если их нет."""
#         if not self._connect:
#             return
#         self.client.command('''
#             CREATE TABLE IF NOT EXISTS users (
#                 id UUID DEFAULT generateUUIDv4(),
#                 email String,
#                 hashed_password String
#             ) ENGINE = ReplacingMergeTree()
#             ORDER BY email
#         ''')

#         # self.client.command('''
#         #     CREATE TABLE IF NOT EXISTS portfolios (
#         #         id UUID DEFAULT generateUUIDv4(),
#         #         user_email String,
#         #         name String,
#         #         stocks Array(String)
#         #     ) ENGINE = ReplacingMergeTree()
#         #     ORDER BY (user_email, name)
#         # ''')
#         self.client.command('''
#             CREATE TABLE IF NOT EXISTS portfolios (
#                 id UUID DEFAULT generateUUIDv4(),
#                 user_email String,
#                 name String,
#                 created_at DateTime DEFAULT now(),
#                 updated_at DateTime DEFAULT now()
#             ) ENGINE = ReplacingMergeTree()
#             ORDER BY (user_email, name)
#         ''')

#         self.client.command('''
#             CREATE TABLE IF NOT EXISTS portfolio_stocks (
#                 portfolio_id UUID,
#                 ticker String,
#                 allocation Float32
#             ) ENGINE = ReplacingMergeTree()
#             ORDER BY (portfolio_id, ticker)
#         ''')

#         # self.client.command('''
#         #     CREATE TABLE IF NOT EXISTS portfolio_settings (
#         #         portfolio_id UUID,
#         #         strategy String,
#         #         risk_level Float32,
#         #         rebalance_period String,
#         #         constraints String
#         #     ) ENGINE = ReplacingMergeTree()
#         #     ORDER BY portfolio_id
#         # ''')


#     def _delete_tables(self, name: str):
#         """Удаляет таблицу с заданным именем"""
#         self._ensure_connection()
#         try:
#             query = f"DROP TABLE IF EXISTS {name}"
#             self.client.command(query)
#             print(f"Таблица {name} успешно удалена.")
#         except Exception as e:
#             print(f"Ошибка при удалении таблицы {name}: {e}")

#     def create_portfolio(self, user_email: str, name: str, stocks: list):
#         self._ensure_connection()
#         query = "INSERT INTO portfolios (user_email, name, stocks) VALUES (%(user_email)s, %(name)s, %(stocks)s)"
#         self.client.command(query, {"user_email": user_email, "name": name, "stocks": stocks})

#     def get_user_portfolios(self, user_email: str):
#         """Получает список всех портфелей пользователя"""
#         self._ensure_connection()
#         query = "SELECT id, name, stocks, user_email FROM portfolios WHERE user_email = %(user_email)s"
#         result = self.client.query(query, {"user_email": user_email}).result_rows
#         return [{"id": str(row[0]), "name": row[1], "stocks": row[2], "user_email": row[3]} for row in result]

#     def get_all_portfolios(self):
#         """Получает список всех портфелей пользователя"""
#         self._ensure_connection()
#         query = "SELECT id, name, stocks, user_email FROM portfolios"
#         result = self.client.query(query).result_rows
#         return [{"id": str(row[0]), "name": row[1], "stocks": row[2], "user_email": row[3]} for row in result]

    # def update_portfolio(self, user_email: str, portfolio_id: str, name: str | None, stocks: List[str] | None):
    #     self._ensure_connection()
    
    #     # Проверяем, есть ли портфель у пользователя
    #     query_check = "SELECT count() FROM portfolios WHERE id = %(id)s AND user_email = %(user_email)s"
    #     existing = self.client.query(query_check, {"id": portfolio_id, "user_email": user_email}).result_rows[0][0]
        
    #     if existing == 0:
    #         raise Exception("Портфель не найден или не принадлежит пользователю")
    
    #     # Удаляем старую запись
    #     query_delete = "ALTER TABLE portfolios DELETE WHERE id = %(id)s AND user_email = %(user_email)s"
    #     self.client.command(query_delete, {"id": portfolio_id, "user_email": user_email})
    
    #     # Вставляем обновленные данные
    #     query_insert = """
    #     INSERT INTO portfolios (id, name, stocks, user_email) 
    #     VALUES (%(id)s, %(name)s, %(stocks)s, %(user_email)s)
    #     """
    
    #     params = {
    #         "id": portfolio_id,
    #         "user_email": user_email,
    #         "name": name if name else "(SELECT name FROM portfolios WHERE id = %(id)s AND user_email = %(user_email)s)",
    #         "stocks": stocks if stocks else "(SELECT stocks FROM portfolios WHERE id = %(id)s AND user_email = %(user_email)s)",
    #     }
    
    #     self.client.command(query_insert, params)



#     def get_portfolio_by_id(self, user_email: str, portfolio_id: str):
#         """Получает один портфель по его ID"""
#         self._ensure_connection()

#         print(f"🔹 SQL-запрос: SELECT id, name, stocks FROM portfolios WHERE user_email = {user_email} AND id = {portfolio_id}")

#         query = "SELECT id, name, stocks FROM portfolios WHERE user_email = %(user_email)s AND id = %(portfolio_id)s"
#         result = self.client.query(query, {"user_email": user_email, "portfolio_id": portfolio_id}).result_rows

#         print(f"🔹 Результат запроса: {result}")

#         if result:
#             return {
#                 "id": str(result[0][0]),
#                 "name": result[0][1],
#                 "stocks": result[0][2],
#                 "user_email": user_email
#             }

#         return None


#     def delete_portfolio(self, user_email: str, portfolio_id: str):
#         self._ensure_connection()

#         query = "SELECT count() FROM portfolios WHERE id = %(id)s AND user_email = %(user_email)s"
#         existing = self.client.query(query, {"id": portfolio_id, "user_email": user_email}).result_rows[0][0]
#         if existing == 0:
#             raise Exception("Портфель не найден или не принадлежит пользователю")

#         delete_query = "ALTER TABLE portfolios DELETE WHERE id = %(id)s AND user_email = %(user_email)s"
#         self.client.command(delete_query, {"id": portfolio_id, "user_email": user_email})


#     def get_user_by_email(self, email: str):
#         self._ensure_connection()
#         query = "SELECT hashed_password FROM users WHERE email = %(email)s"
#         result = self.client.query(query, {"email": email}).result_rows
#         return result[0][0] if result else None

#     def create_user(self, email: str, hashed_password: str):
#         self._ensure_connection()

#         query = "SELECT count() FROM users WHERE email = %(email)s"
#         existing = self.client.query(query, {"email": email}).result_rows[0][0]
#         if existing > 0:
#             raise Exception("Пользователь уже существует")

#         insert_query = "INSERT INTO users (email, hashed_password) VALUES (%(email)s, %(password)s)"
#         self.client.command(insert_query, {"email": email, "password": hashed_password})

#     def delete_user(self, email: str):
#         self._ensure_connection()

#         query = "SELECT count() FROM users WHERE email = %(email)s"
#         existing = self.client.query(query, {"email": email}).result_rows[0][0]
#         if existing == 0:
#             raise Exception("Пользователь не найден")

#         delete_query = "ALTER TABLE users DELETE WHERE email = %(email)s"
#         self.client.command(delete_query, {"email": email})

#         return {"message": "Аккаунт успешно удалён"}
    


# # bd = ClickHouseDB()
# # # bd._delete_tables("portfolios")
# # bd._create_tables()
# # print(bd.client.query("DESCRIBE TABLE portfolios").result_rows)
# # print(bd.client.query("DESCRIBE TABLE portfolio_stocks").result_rows)
