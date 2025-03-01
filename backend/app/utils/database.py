class ClickHouseDB:
    def __init__(self, host="localhost", port=8123):
        import clickhouse_connect
        self.client = clickhouse_connect.get_client(host=host, port=port)
        self._create_tables()

    def _create_tables(self):
        self.client.query('''
            CREATE TABLE IF NOT EXISTS users (
                id UUID DEFAULT generateUUIDv4(),
                email String,
                hashed_password String
            ) ENGINE = ReplacingMergeTree()
            ORDER BY email
        ''')

    def get_user_by_email(self, email: str):
        result = self.client.query(f"SELECT hashed_password FROM users WHERE email = '{email}'").result_rows
        return result[0][0] if result else None

    def create_user(self, email: str, hashed_password: str):
        existing = self.client.query(f"SELECT count() FROM users WHERE email = '{email}'").result_rows[0][0]
        if existing > 0:
            raise Exception("Пользователь уже существует")
        self.client.query(f"INSERT INTO users (email, hashed_password) VALUES ('{email}', '{hashed_password}')")

    def delete_user(self, email: str):
        existing = self.client.query(f"SELECT count() FROM users WHERE email = '{email}'").result_rows[0][0]
        if existing == 0:
            raise Exception("Пользователь не найден")
        self.client.query(f"ALTER TABLE users DELETE WHERE email = '{email}'")
        return {"message": "Аккаунт успешно удалён"}