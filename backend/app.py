from flask import Flask, request, jsonify
import joblib
from flask_cors import CORS
import cv2
import numpy as np
from pyzbar.pyzbar import decode
import logging


app = Flask(__name__)
CORS(app)

# 로깅 설정
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# 모델 로드
model = joblib.load('./models/MNB_TFIDF.pkl')

def predict_url(url):
    prediction = model.predict([url]) 
    return prediction[0]

# @app.route('/urltest', methods=['POST'])
# def predict():
#     data = request.get_json()
    
#     # 요청 데이터 로그 출력
#     app.logger.info(f"URL 예측용 데이터: {data}")

#     if 'url' not in data:
#         return jsonify({'status': 'error', 'message': 'URL이 제공되지 않았습니다.'}), 400

#     url = data['url']
    
#     try:
#         prediction = predict_url(url)
        
#         if prediction == 'good':
#             app.logger.info(f"URL '{url}' 은 안전합니다")
#             return jsonify({'status': 'good', 'message': '이 URL은 안전합니다'})
#         elif prediction == 'bad':
#             app.logger.warning(f"URL '{url}' 위험해 보입니다")
#             return jsonify({'status': 'bad', 'message': '이 URL은 보안 위험이 있을 수 있습니다'})
        
#     except Exception as e:
#         app.logger.error(f"예측 중 오류 발생: {str(e)}")
#         return jsonify({'status': 'error', 'message': f'예측 중 오류 발생: {str(e)}'}), 500

@app.route('/scan', methods=['POST'])
def scan_qr_code():
    app.logger.info("QR코드 스캔 요청.")
    
    if 'image' not in request.files:
        return jsonify({'status': 'error', 'message': '이미지가 제공되지 않았습니다.'}), 400

    file = request.files['image']
    
    try:
        # 이미지를 OpenCV 형식으로 읽기
        file_bytes = np.frombuffer(file.read(), np.uint8)
        image = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)

        # QR 코드 디코딩
        decoded_objects = decode(image)
        
        if not decoded_objects:
            app.logger.warning("QR코드가 인식되지않았습니다")
            return jsonify({'status': 'error', 'message': 'QR 코드를 인식할 수 없습니다.'}), 400

        # 첫 번째 QR 코드에서 URL 추출
        url = decoded_objects[0].data.decode('utf-8')
        app.logger.info(f"QR코드에서 추출한 URL: {url}")

        # URL 예측
        prediction = predict_url(url)

        if prediction == 'good':
            app.logger.info(f"URL '{url}' is classified as safe.")
            return jsonify({'status': 'good', 'message': '이 URL은 안전합니다', 'url': url})
        elif prediction == 'bad':
            app.logger.warning(f"URL '{url}' is classified as potentially harmful.")
            return jsonify({'status': 'bad', 'message': '이 URL은 보안 위험이 있을 수 있습니다', 'url': url})
        
    except Exception as e:
        app.logger.error(f"Error processing QR code: {str(e)}")
        return jsonify({'status': 'error', 'message': f'QR 코드 처리 중 오류 발생: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(debug=True)
