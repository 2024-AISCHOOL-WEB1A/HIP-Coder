from flask import Blueprint, request, jsonify
from sklearn.feature_extraction.text import TfidfVectorizer
import joblib
import logging
import os
import numpy as np
import pandas as pd

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')


urlscan_bp = Blueprint('urlscan', __name__)

trust_url = pd.read_csv('./data_with_trust_url.csv')
trust_urls = trust_url['url'].values


clf_model, tfidf_vectorizer = joblib.load(os.path.join(os.path.dirname(__file__), 'model_test.pkl'))



def tokenize_url(url):
    tokens = []
    for part in url.split('/'):
        tokens.extend(part.split('.'))
    return ' '.join(tokens)


def predict_url(url):
    prediction = None 

    try:
        for trust in trust_url['url']:
            if trust in url:
                logging.info(f"URL '{url}'는 신뢰할 수 있는 URL '{trust}'를 포함합니다.")
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



@urlscan_bp.route('/test', methods=['GET'])
def test():
    return jsonify({'test': 'test'})


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
