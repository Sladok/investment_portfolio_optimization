from fastapi import APIRouter, Depends
from backend.app.utils.database import ClickHouseDB
import json

router = APIRouter()
db = ClickHouseDB()


@router.get("/tables")
def get_tables():
    try:
        tables = db.client.query("SHOW TABLES").result_rows
        return {"tables": [table[0] for table in tables]}
    except Exception as e:
        return {"error": str(e)}


@router.get("/table/{table_name}")
def get_table_data(table_name: str):
    try:
        # print(f"Получаем данные из таблицы: {table_name}")  # Отладка
        data = db.client.query(f"SELECT * FROM {table_name} LIMIT 100").result_rows

        columns = db.client.query(f"DESCRIBE TABLE {table_name}").result_rows
        column_names = [col[0] for col in columns]

        def process_value(value):
            if isinstance(value, str): 
                try:
                    return json.loads(value) 
                except json.JSONDecodeError:
                    return value
            return value

        processed_data = [
            [process_value(value) for value in row] for row in data
        ]

        return {"table": table_name, "columns": column_names, "data": processed_data}
    except Exception as e:
        print(f"Ошибка: {e}")  # Отладка
        return {"error": str(e)}
