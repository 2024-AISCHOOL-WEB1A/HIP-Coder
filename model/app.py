from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import logging
import os

# Flask 애플리케이션 초기화 및 CORS 설정
app = Flask(__name__)
CORS(app)

# 로깅 설정
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# URL 분류 모델 로드
clf_model_path = os.path.join(os.path.dirname(__file__), 'MNB_TFIDF.pkl')
try:
    clf_model = joblib.load(clf_model_path)
    app.logger.info("URL 분류 모델 로드 완료.")
except Exception as e:
    app.logger.error(f"URL 분류 모델 로드 실패: {e}")

# URL 예측 함수 정의
def predict_url(url):
    """URL을 분류하여 'good' 또는 'bad'로 반환."""
    try:
        prediction = clf_model.predict([url])
        return prediction[0]
    except Exception as e:
        app.logger.error(f"URL 예측 중 오류 발생: {e}")
        return None

@app.route('/scan', methods=['POST'])
def scan_qr_code():
    """QR 코드에서 추출된 URL을 받아 분류하여 반환."""
    app.logger.info("URL 분류 요청 수신.")

    # 요청에서 URL 추출
    url = request.json.get('url')
    if not url:
        app.logger.warning("URL이 제공되지 않았습니다.")
        return jsonify({'status': 'error', 'message': 'URL이 제공되지 않았습니다.'}), 400

    # URL 분류 예측
    prediction = predict_url(url)
    if prediction == 'good':
        app.logger.info(f"URL '{url}'는 안전합니다.")
        return jsonify({'status': 'good', 'message': '이 URL은 안전합니다.', 'url': url})
    elif prediction == 'bad':
        app.logger.warning(f"URL '{url}'는 위험할 수 있습니다.")
        return jsonify({'status': 'bad', 'message': '이 URL은 보안 위험이 있을 수 있습니다.', 'url': url})
    else:
        return jsonify({'status': 'error', 'message': 'URL을 분류할 수 없습니다.', 'url': url}), 500

if __name__ == '__main__':
    app.run(debug=True)
