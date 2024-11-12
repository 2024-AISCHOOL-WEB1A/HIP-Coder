from flask import Blueprint, request, jsonify
from sklearn.feature_extraction.text import TfidfVectorizer
import joblib
import logging
import os
import numpy as np
import cv2
import tempfile
from pyzbar.pyzbar import decode
import requests
from urllib.parse import urlparse
import pandas as pd
from scipy.sparse import hstack
from bs4 import BeautifulSoup
from flask_jwt_extended import verify_jwt_in_request,get_jwt_identity,JWTManager
from dotenv import load_dotenv
import mysql.connector
from sqlalchemy import create_engine
import pymysql
from flask_jwt_extended import create_access_token


load_dotenv()

# 로깅 설정
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')


db_config = {
    'host': os.getenv('DB_HOST'),
    'user': os.getenv('DB_USER'),
    'password': os.getenv('DB_PASSWORD'),
    'database': os.getenv('DB_NAME'),
    'port': int(os.getenv('DB_PORT'))  # 포트 정보 추가
}
urlscan_bp = Blueprint('urlscan', __name__)


# 데이터베이스 설정
db_config2 = {
    'host': os.getenv('DB_HOST'),
    'user': os.getenv('DB_USER'),
    'password': os.getenv('DB_PASSWORD'),
    'database': os.getenv('DB_NAME'),
    'port': int(os.getenv('DB_PORT'))  # 포트 정보 추가
}

# SQLAlchemy를 사용하여 DB 연결 생성
engine = create_engine(f"mysql+mysqlconnector://{db_config2['user']}:{db_config2['password']}@{db_config2['host']}:{db_config2['port']}/{db_config2['database']}")

# DB에서 신뢰 URL 로드
try:
    trust_url_df = pd.read_sql("SELECT URL FROM SAFE_SITE WHERE SAFE_TYPE = 'G'", con=engine)
    trust_urls = trust_url_df['URL'].values
except Exception as e:
    logging.error("데이터베이스에서 신뢰 URL을 로드하는 동안 오류 발생: %s", str(e))
    trust_urls = []
logging.info(f"총 {len(trust_urls)}개의 신뢰할 수 있는 URL이 로드되었습니다.")
    
trusted_tlds = {
    '.com', '.org', '.net', '.gov', '.edu', '.mil', '.int',  # 일반적인 신뢰 TLD
    '.co', '.us', '.uk', '.ca', '.de', '.fr', '.au', '.jp',  # 국가별 일반 TLD
    '.eu', '.nz', '.ie', '.ch', '.nl', '.in', '.br', '.kr',  # 국가별 일반 TLD
    '.cn', '.sg', '.hk', '.za', '.mx', '.es', '.it', '.se',  # 국가별 일반 TLD
    '.fi', '.no', '.pl', '.pt', '.ru', '.be', '.gr', '.dk',  # 국가별 일반 TLD
    '.cz', '.sk', '.tr', '.ar', '.tw', '.id', '.th', '.vn'   # 기타 국가별 TLD
}


#model_path = os.path.join(os.path.dirname(__file__), 'mnb_model_with_vectorizer.pkl')
#model_path = os.path.join(os.path.dirname(__file__), 'log_reg_model_with_vectorizer.pkl')
model_path = os.path.join(os.path.dirname(__file__), 'ensemble_model_with_vectorizer.pkl')
vectorizer, ensemble_model = joblib.load(model_path)



def extract_domain(url):
    if not url.startswith(('http://', 'https://')):
        url = 'http://' + url
    parsed_url = urlparse(url)
    domain = parsed_url.netloc
    if domain.startswith('www.'):
        domain = domain[4:]
    return domain


def tokenize_url(url):
    tokens = []
    for part in url.split('/'):
        tokens.extend(part.split('.'))
    return ' '.join(tokens)



# 추가 피처 추출 함수
def extract_features(url):
    features = {}
    parsed_url = urlparse(url)

    # URL 기반 특징
    features['url_length'] = len(url)
    features['hostname_length'] = len(parsed_url.hostname) if parsed_url.hostname else 0
    features['num_slashes'] = url.count('/')
    features['num_special_chars'] = sum([url.count(char) for char in ['-', '_', '.', '@', '&']])
    features['is_https'] = 1 if parsed_url.scheme == 'https' else 0

    # 도메인 기반 특징
    hostname = parsed_url.hostname if parsed_url.hostname else ""
    features['num_digits_in_domain'] = sum(char.isdigit() for char in hostname)

    # 추가 특징
    features['is_trusted_tld'] = 1 if any(hostname.endswith(tld) for tld in trusted_tlds) else 0
    features['is_short_url'] = 1 if features['hostname_length'] <= 10 else 0

    return pd.Series(features)

def predict_url(url):
    prediction = None
    
    try:
        domain = extract_domain(url)
        logging.info(f"추출된 도메인: {domain}")

        
        if domain in trust_urls:
            logging.info(f"URL '{url}'는 신뢰할 수 있는 도메인 '{domain}'과 일치하므로 'good'으로 분류됩니다.")
            return 'good'   

        new_url = [url]
        new_feature_df = pd.DataFrame(new_url, columns=['url']).apply(lambda x: extract_features(x['url']), axis=1)
        new_vec = vectorizer.transform(new_url)
        new_combined = hstack([new_vec, new_feature_df])

        # 예측
        prediction_prob = ensemble_model.predict_proba(new_combined)
        logging.info(f" Prediction Probability for new URL: {prediction_prob}")

        # 예측 결과 출력
        prediction = 'good' if prediction_prob[0][1] > 0.5 else 'bad'
        logging.info(f"enssemble  {new_url[0]}: {prediction}")

        return prediction

    except Exception as e:
        logging.error("URL 예측 중 오류 발생: %s", str(e), exc_info=True)
        return None 

# 갤러리에서 검사 하는 부분
@urlscan_bp.route('/test', methods=['POST'])
def test():
    if 'photo' not in request.files:
        return jsonify({'error': 'No photo uploaded'}), 400

    photo = request.files['photo']
    try:
        # 임시 파일로 이미지 저장
        with tempfile.NamedTemporaryFile(delete=False) as temp_file:
            photo.save(temp_file.name)

            # 이미지 읽기
            image = cv2.imread(temp_file.name)
            if image is None:
                logging.error("이미지를 읽지 못했습니다.")
                return jsonify({'error': 'Failed to read image'}), 500

            # 이미지 흑백 변환
            gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

            # QR 코드 디코딩
            qr_codes = decode(gray_image)
            if len(qr_codes) == 0:
                logging.warning('QR 코드가 인식되지 않았습니다.')
                return jsonify({'error': 'No QR code detected'}), 400

            # QR 코드 데이터 추출
            qr_data = qr_codes[0].data.decode('utf-8')
            logging.info(f'QR 코드에서 추출한 URL: {qr_data}')
            
            # URL을 /scan으로 전송
            logging.info(f'QR 데이터로 전송할 URL: {qr_data}')
            response = requests.post('{FLASK_URL}/scan', json={'url': qr_data, 'category': "IMG" })

            if response.status_code == 200:
                return response.json()
            else:
                logging.error(f'/scan 요청 실패: {response.status_code}, 응답 내용: {response.text}')
                return jsonify({'error': 'Failed to send URL to /scan'}), 500

    except Exception as e:
        logging.error(f"예외 발생: {str(e)}", exc_info=True)
        return jsonify({'error': str(e)}), 500
    finally:
        # 임시 파일 삭제
        if os.path.exists(temp_file.name):
            try:
                os.remove(temp_file.name)
            except PermissionError as pe:
                logging.error(f"파일 삭제 오류: {temp_file.name} - {str(pe)}")
                

def save_scan_result(user_idx, url_data, scan_result, category):
    try:
        connection = pymysql.connect(**db_config)
        with connection.cursor() as cursor:
            sql = "INSERT INTO SCAN_QR (USER_IDX, SCAN_URL, SCAN_RESULT, QR_CAT) VALUES (%s, %s, %s, %s)"
            cursor.execute(sql, (user_idx, url_data, scan_result, category))
            connection.commit()
    except Exception as e:
        logging.error(f"데이터베이스에 저장하는 중 오류 발생: {e}")
    finally:
        connection.close()


# 카메라에서 qr스캔 했을때
@urlscan_bp.route('/scan', methods=['POST'])
def scanurl():
    url_data = request.json.get('url')
    category = request.json.get('category')
    
    if not url_data:
        logging.warning("URL이 제공되지 않았습니다.")
        return jsonify({'status': 'error', 'message': 'URL이 제공되지 않았습니다.'}), 400

    logging.info(f"요청받은 URL: {url_data}, 카테고리: {category}")

    # URL 분류 예측 수행
    prediction = predict_url(url_data)

    # 분류 결과에 따른 응답 생성
    if prediction == 'good':
        scan_result = 'good'
        logging.info(f"URL '{url_data}'는 안전합니다.")
        response = jsonify({'status': 'good', 'message': '이 URL은 안전합니다.', 'url': url_data})
    elif prediction == 'bad':
        scan_result = 'bad'
        logging.warning(f"URL '{url_data}'는 위험할 수 있습니다.")
        response = jsonify({'status': 'bad', 'message': '이 URL은 보안 위험이 있을 수 있습니다.', 'url': url_data})
    else:
        logging.error("URL을 분류할 수 없습니다.")
        return jsonify({'status': 'error', 'message': 'URL을 분류할 수 없습니다.', 'url': url_data}), 500
    try:
        verify_jwt_in_request(optional=True)
        user_idx = get_jwt_identity()
        logging.info(f"요청한 사용자 ID: {user_idx}")
        
        
            
        if user_idx:
            if scan_result =='bad' :
                scan_result = 'B'
            elif scan_result =='good' :
                scan_result = 'G'
            # 스캔 결과 저장
            save_scan_result(user_idx, url_data, scan_result, category)  # user_idx로 수정
            logging.info(f"결과값 저장 완료: user_idx={user_idx}, url={url_data}, scan_result={scan_result}, category={category}")
        else:
            logging.info("JWT가 없거나 user_idx를 찾을 수 없습니다. 결과값은 저장되지 않았습니다.")
    except Exception as e:
        logging.error(f"JWT 확인 중 오류 발생: {e}")
    
    logging.info(f"응답 데이터: {response}")
    return response
    
