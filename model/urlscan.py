from flask import Blueprint, request, jsonify
from sklearn.feature_extraction.text import TfidfVectorizer
import joblib
import logging
import os
import numpy as np
import cv2
import tempfile
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
def load_trust_urls_from_db():
    connection =  db_con()
    
    try:
        query = "SELECT URL FROM SAFE_SITE WHERE SAFE_TYPE = 'G'"
        trust_urls_df = pd.read_sql(query, connection)
        num_urls = len(trust_urls_df)
        logging.info(f"db에서 신뢰 URL {num_urls}개를 로드했습니다.")
        return trust_urls_df['URL'].values
    except Exception as e:
        print("데이터베이스에서 신뢰 URL을 로드하는 중 오류 발생:", e)
        return []
    finally:
        connection.close()


trust_urls = load_trust_urls_from_db()

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
    if not url.startswith(('http://', 'https://')):
        url = 'http://' + url
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

            # OpenCV의 QRCodeDetector를 사용해 QR 코드 인식
            qr_detector = cv2.QRCodeDetector()
            qr_data, vertices_array, _ = qr_detector.detectAndDecode(image)

            # QR 코드가 인식되지 않은 경우
            if vertices_array is None or len(vertices_array) == 0:
                logging.warning('QR 코드가 인식되지 않았습니다.')
                return jsonify({'error': 'No QR code detected'}), 400

            # QR 코드 데이터가 추출된 경우
            logging.info(f'QR 코드에서 추출한 URL: {qr_data}')

            # Authorization 헤더 전달
            auth_header = request.headers.get("Authorization")
            headers = {"Authorization": auth_header} if auth_header else {}

            # /scan 엔드포인트에 POST 요청 시 Authorization 헤더 전달
            response = requests.post(f'{flask_url}/scan', json={'url': qr_data, 'category': "IMG"}, headers=headers)

            if response.status_code != 200:
                logging.error(f"/scan 엔드포인트에 요청 중 오류 발생: {response.status_code}")
                return jsonify({'error': 'Failed to send URL to /scan'}), 500
            
            return response.json()

    except Exception as e:
        logging.error(f"예외 발생: {str(e)}", exc_info=True)
        return jsonify({'error': '서버 오류 발생'}), 500
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

def update_count_logs(scan_result):
    """
    COUNT_LOGS 테이블에 데이터를 추가하는 함수
    G일 경우 QR 하나 추가, B일 경우 QR과 URL을 각각 하나씩 추가
    """
    try:
        connection = db_con()
        with connection.cursor() as cursor:
            # G일 경우 QR 로그 추가
            if scan_result == 'G':
                cursor.execute("INSERT INTO COUNT_LOGS (TYPE, COUNT_VALUE) VALUES ('QR', 1)")
            # B일 경우 QR와 URL 로그 각각 추가
            elif scan_result == 'B':
                cursor.execute("INSERT INTO COUNT_LOGS (TYPE, COUNT_VALUE) VALUES ('QR', 1)")
                cursor.execute("INSERT INTO COUNT_LOGS (TYPE, COUNT_VALUE) VALUES ('URL', 1)")
            connection.commit()
    except Exception as e:
        logging.error(f"COUNT_LOGS 테이블 업데이트 중 오류 발생: {e}")
    finally:
        if 'connection' in locals():
            connection.close()        

@urlscan_bp.route('/scan', methods=['POST'])
def scanurl():
    print("Headers:", request.headers)
    auth_header = request.headers.get("Authorization")
    print("Received Authorization header:", auth_header)

    url_data = request.json.get('url')
    cat = request.json.get('category')  # 프론트엔드에서 전달받은 category 값

    if not url_data:
        logging.warning("URL이 제공되지 않았습니다.")
        return jsonify({'status': 'error', 'message': 'URL이 제공되지 않았습니다.'}), 400

    logging.info(f"요청받은 URL: {url_data} | 카테고리: {cat}")

    # URL 안전성 검사 - good or bad 예측
    prediction = predict_url(url_data)
    scan_result = 'G' if prediction == 'good' else 'B'

    response = jsonify({
        'status': 'good' if scan_result == 'G' else 'bad',
        'message': '이 URL은 안전합니다.' if scan_result == 'G' else '이 URL은 보안 위험이 있을 수 있습니다.',
        'url': url_data
    })

    # COUNT_LOGS 테이블 업데이트
    update_count_logs(scan_result)

    # JWT 토큰이 있는 경우에만 가져와서 디코딩 처리
    logging.info(f"Authorization 헤더: {auth_header}")

    user_id = "비회원"  # 기본값으로 비회원 설정

    if auth_header:
        try:
            token = auth_header.split(" ")[1]  # 'Bearer <토큰>'에서 <토큰>만 추출
            logging.info(f"JWT 토큰 추출: {token}")
            decoded_token = decode_jwt_token(token)
            if decoded_token:
                user_id = decoded_token.get('id', '비회원')
                logging.info(f"user_id 추출: {user_id}")
            else:
                logging.warning("토큰 디코딩 실패로 비회원 처리")
        except Exception as e:
            logging.error(f"JWT 디코딩 중 오류 발생: {e}")

    # 검사 결과 저장 시 QR_CAT도 함께 저장
    save_scan_result(user_id, url_data, scan_result, cat)  # QR_CAT으로 받은 category 값도 저장

    return response

@urlscan_bp.route('/tt', methods=['POST'])
def test_token():
    logging.info("Received request on /tt endpoint")
    
    # 요청 헤더에 포함된 Authorization 헤더 확인
    auth_header = request.headers.get("Authorization")
    logging.info(f"Received Authorization header: {auth_header}")
    
    user_id = "비회원"  # 기본값 설정
    
    if auth_header:
        try:
            token = auth_header.split(" ")[1]
            logging.info(f"JWT 토큰 추출: {token}")
            decoded_token = decode_jwt_token(token)
            if decoded_token:
                user_id = decoded_token.get('id', '비회원')
                logging.info(f"디코딩된 사용자 ID: {user_id}")
            else:
                logging.warning("토큰 디코딩 실패 - 비회원 처리")
        except Exception as e:
            logging.error(f"JWT 디코딩 중 오류 발생: {e}")
    
    # 테스트 응답 반환
    return jsonify({"message": f"인증된 사용자: {user_id}"}), 200

@urlscan_bp.route('/mainurl', methods=['POST'])
def mainurl():
    url_data = request.json.get('url')
    prediction = predict_url(url_data)
    scan_result = 'G' if prediction == 'good' else 'B'

    response = jsonify({
        'status': scan_result,
        'message': '안전한 URL입니다.' if scan_result == 'G' else '이 URL은 보안 위험이 있을 수 있습니다.',
        'url': url_data
    })
    return response