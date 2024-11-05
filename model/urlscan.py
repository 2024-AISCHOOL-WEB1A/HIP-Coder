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

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')


urlscan_bp = Blueprint('urlscan', __name__)

trust_url = pd.read_csv('./data_with_trust_url.csv')
trust_urls = trust_url[trust_url['type'] == 'trust']['url'].values


clf_model, tfidf_vectorizer = joblib.load(os.path.join(os.path.dirname(__file__), 'model_final.pkl'))

def extract_domain(url):
    from urllib.parse import urlparse
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


def predict_url(url):
    prediction = None 

    try:
        domain = extract_domain(url)
        logging.info(f"추출된 도메인: {domain}")

        # 신뢰할 수 있는 도메인 검사
        if domain in trust_urls:
            logging.info(f"URL '{url}'는 신뢰할 수 있는 도메인 '{domain}'을 포함합니다.")
            return 'good'  

        list_url = [url]
        logging.info("벡터라이저 타입: %s", type(tfidf_vectorizer))
        logging.info("모델 타입: %s", type(clf_model))
        

        new_url_tfidf = tfidf_vectorizer.transform(list_url) 
        logging.info("벡터화 완료: %s", new_url_tfidf)

        pred_prob = clf_model.predict_proba(new_url_tfidf)  
        logging.info("예측 확률: %s", pred_prob)

        prediction = 'good' if pred_prob[0][1] > 0.5 else 'bad'
        logging.info("최종 예측: %s", prediction)

        return prediction

    except Exception as e:
        logging.error("URL 예측 중 오류 발생: %s", str(e), exc_info=True)
        return prediction 



# 테스트 엔드포인트
@urlscan_bp.route('/test', methods=['POST'])
def test():
    print('요청')
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
            response = requests.post('http://192.168.21.107:5000/scan', json={'url': qr_data})
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



@urlscan_bp.route('/scan', methods=['POST'])
def scanurl():
    url_data = request.json.get('url')

    if not url_data:
        logging.warning("URL이 제공되지 않았습니다.")
        return jsonify({'status': 'error', 'message': 'URL이 제공되지 않았습니다.'}), 400

    logging.info(f"요청받은 URL: {url_data}")

    prediction = predict_url(url_data)

    if prediction == 'good':
        logging.info(f"URL '{url_data}'는 안전합니다.")
        return jsonify({'status': 'good', 'message': '이 URL은 안전합니다.', 'url': url_data})
    elif prediction == 'bad':
        logging.warning(f"URL '{url_data}'는 위험할 수 있습니다.")
        return jsonify({'status': 'bad', 'message': '이 URL은 보안 위험이 있을 수 있습니다.', 'url': url_data})
    else:
        return jsonify({'status': 'error', 'message': 'URL을 분류할 수 없습니다.', 'url': url_data}), 500



@urlscan_bp.route('/tt', methods=['POST'])
def tt():
    print('dd')
    data = request.get_json()
    print(data)
    return jsonify({'message': '1'})
