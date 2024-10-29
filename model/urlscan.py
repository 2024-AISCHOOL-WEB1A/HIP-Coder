from flask import Blueprint, request, jsonify
from sklearn.feature_extraction.text import TfidfVectorizer
import joblib
import logging
import os
import numpy as np
# 로깅 설정
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Blueprint 초기화
urlscan_bp = Blueprint('urlscan', __name__)

# TF-IDF 벡터 변환기와 모델을 전역 변수로 설정
tfidf_vectorizer, clf_model = joblib.load(os.path.join(os.path.dirname(__file__), 'model_and_vectorizer.pkl'))


# URL 토큰화 함수
def tokenize_url(url):
    tokens = []
    for part in url.split('/'):
        tokens.extend(part.split('.'))
    return ' '.join(tokens)

# URL 예측 함수
def predict_url(url):
    try:
        
        
        list_url = [url]
        vectorizer = tfidf_vectorizer
        logging.info("백터라이저: %s", vectorizer)
        new_url_tfidf = vectorizer.transform(list_url) 
        logging.info("벡터화 완료: %s", new_url_tfidf)
        pred_prob = clf_model.predict_proba(new_url_tfidf)  
        logging.info("예측: %s", pred_prob)
        
        # 예측 결과에 따라 'good' 또는 'bad' 결정
        prediction = 'good' if pred_prob[0][1] > 0.8 else 'bad' 
        return prediction

    except Exception as e:
        logging.error("URL 예측 중 오류 발생: %s", str(e), exc_info=True)
        return None


# 테스트 엔드포인트
@urlscan_bp.route('/test', methods=['GET'])
def test():
    return jsonify({'test': 'test'})

# URL 스캔 엔드포인트
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
