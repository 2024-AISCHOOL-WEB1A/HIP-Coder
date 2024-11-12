import jwt
import os
from flask import current_app
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv('SECRET_KEY')

def decode_jwt_token(token):
    current_app.logger.info(f"받은 토큰: {token}")  # 토큰 로그 출력
    try:
        decoded_token = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return decoded_token
    except jwt.ExpiredSignatureError:
        current_app.logger.error("토큰이 만료되었습니다.")
        return None
    except jwt.InvalidTokenError:
        current_app.logger.error("유효하지 않은 토큰입니다.")
        return None
