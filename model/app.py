from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import os
from flask_jwt_extended import JWTManager

# 다른 모듈에서 블루프린트 가져오기
from urlscan import urlscan_bp

# 환경 변수 로드
load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, expose_headers=["Authorization"])

app.config['JWT_SECRET_KEY'] = os.getenv('SECRET_KEY')  # JWTManager와 호환되도록 JWT_SECRET_KEY 설정
jwt = JWTManager(app)

# 블루프린트 등록
app.register_blueprint(urlscan_bp)

if __name__ == '__main__':
    app.run(debug=True, port=5000, host='0.0.0.0')
