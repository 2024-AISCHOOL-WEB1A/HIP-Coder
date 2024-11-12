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
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity, JWTManager
from dotenv import load_dotenv
import pymysql
from config.db import db_con  # config.db에서 db_con 가져오기
from config.jwt import decode_jwt_token


load_dotenv()

flask_url = os.getenv('FLASK_URL')

# 로깅 설정
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

urlscan_bp = Blueprint('urlscan', __name__)

# 신뢰 URL 로드
trust_url = pd.read_csv('./data_with_trust_url.csv')
trust_urls = trust_url[trust_url['type'] == 'trust']['url'].values

trusted_tlds = {
    '.com', '.org', '.net', '.gov', '.edu', '.mil', '.int',
    '.co', '.us', '.uk', '.ca', '.de', '.fr', '.au', '.jp',
    '.eu', '.nz', '.ie', '.ch', '.nl', '.in', '.br', '.kr',
    '.cn', '.sg', '.hk', '.za', '.mx', '.es', '.it', '.se',
    '.fi', '.no', '.pl', '.pt', '.ru', '.be', '.gr', '.dk',
    '.cz', '.sk', '.tr', '.ar', '.tw', '.id', '.th', '.vn'
}

# 모델 로드
model_path = os.path.join(os.path.dirname(__file__), 'ensemble_model_with_vectorizer.pkl')
vectorizer, ensemble_model = joblib.load(model_path)

def extract_domain(url):
    parsed_url = urlparse(url)
    domain = parsed_url.netloc
    if domain.startswith('www.'):
        domain = domain[4:]
    return domain

# URL을 토큰화하는 함수
def tokenize_url(url):
    tokens = []
    for part in url.split('/'):
        tokens.extend(part.split('.'))
    return ' '.join(tokens)

# 추가 피처 추출 함수
def extract_features(url):
    parsed_url = urlparse(url)
    hostname = parsed_url.hostname if parsed_url.hostname else ""
    return pd.Series({
        'url_length': len(url),
        'hostname_length': len(hostname),
        'num_slashes': url.count('/'),
        'num_special_chars': sum(url.count(char) for char in ['-', '_', '.', '@', '&']),
        'is_https': int(parsed_url.scheme == 'https'),
        'num_digits_in_domain': sum(char.isdigit() for char in hostname),
        'is_trusted_tld': int(any(hostname.endswith(tld) for tld in trusted_tlds)),
        'is_short_url': int(len(hostname) <= 10)
    })

# URL을 예측하는 함수
def predict_url(url):
    try:
        new_url = [url]
        new_feature_df = pd.DataFrame(new_url, columns=['url']).apply(lambda x: extract_features(x['url']), axis=1)
        new_vec = vectorizer.transform(new_url)
        new_combined = hstack([new_vec, new_feature_df])

        # 예측
        prediction_prob = ensemble_model.predict_proba(new_combined)
        logging.info(f"Prediction Probability for URL: {prediction_prob}")

        return 'good' if prediction_prob[0][1] > 0.5 else 'bad'
    except Exception as e:
        logging.error("URL 예측 중 오류 발생: %s", str(e), exc_info=True)
        return None

# QR 코드 검사 엔드포인트
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

            gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            qr_codes = decode(gray_image)
            if not qr_codes:
                logging.warning('QR 코드가 인식되지 않았습니다.')
                return jsonify({'error': 'No QR code detected'}), 400

            qr_data = qr_codes[0].data.decode('utf-8')
            logging.info(f'QR 코드에서 추출한 URL: {qr_data}')
            
            response = requests.post(f'{flask_url}/scan', json={'url': qr_data, 'category': "IMG"})
            return response.json() if response.status_code == 200 else jsonify({'error': 'Failed to send URL to /scan'}), 500

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

def save_scan_result(user_id, url_data, scan_result, category):
    try:
        connection = db_con()
        with connection.cursor() as cursor:
            sql = "INSERT INTO SCAN_QR (USER_IDX, SCAN_URL, SCAN_RESULT, QR_CAT) VALUES (%s, %s, %s, %s)"
            cursor.execute(sql, (user_id, url_data, scan_result, category))
            connection.commit()
    except Exception as e:
        logging.error(f"데이터베이스에 저장하는 중 오류 발생: {e}")
    finally:
        connection.close()

@urlscan_bp.route('/scan', methods=['POST'])
def scanurl():
    url_data = request.json.get('url')
    cat = request.json.get('category')
    
    if not url_data:
        logging.warning("URL이 제공되지 않았습니다.")
        return jsonify({'status': 'error', 'message': 'URL이 제공되지 않았습니다.'}), 400

    logging.info(f"요청받은 URL: {url_data}")
    prediction = predict_url(url_data)
    scan_result = 'G' if prediction == 'good' else 'B'

    response = jsonify({
        'status': 'good' if scan_result == 'G' else 'bad',
        'message': '이 URL은 안전합니다.' if scan_result == 'G' else '이 URL은 보안 위험이 있을 수 있습니다.',
        'url': url_data
    })

    # JWT 토큰이 있는 경우에만 가져와서 디코딩 처리
    auth_header = request.headers.get("Authorization")
    user_id = "비회원"  # 기본값으로 비회원 설정

    if auth_header:
        try:
            token = auth_header.split(" ")[1]
            decoded_token = decode_jwt_token(token)
            if decoded_token:
                user_id = decoded_token.get('id', '비회원')
                logging.info(f"user_id : '{user_id}'")
            else:
                logging.warning("토큰 디코딩 실패로 비회원 처리")
        except Exception as e:
            logging.error(f"JWT 디코딩 중 오류 발생: {e}")

    # 검사 결과 저장
    save_scan_result(user_id, url_data, scan_result, cat)
    return response
