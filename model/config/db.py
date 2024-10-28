import pymysql
import os
from dotenv import load_dotenv

load_dotenv()  # 환경 변수 로드

def db_con():
    return pymysql.connect(
        host=os.getenv('DB_HOST'),
        user=os.getenv('DB_USER'),
        password=os.getenv('DB_PASSWORD'),
        db=os.getenv('DB_NAME'),
        port=int(os.getenv('DB_PORT')),  # 포트는 정수로 변환
        charset='utf8'
    )
