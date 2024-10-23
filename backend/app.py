
from flask import Flask, request, jsonify
import joblib
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

model = joblib.load('./models/MNB_TFIDF.pkl')

def predict_url(url):
    prediction = model.predict([url]) 
    return prediction[0]

@app.route('/urltest', methods=['POST'])
def predict():
    data = request.get_json()

    if 'url' not in data:
        return jsonify({'status': 'error', 'message': 'URL이 제공되지 않았습니다.'}), 400

    url = data['url']
    
    try:
        
        prediction = predict_url(url)
        
        
        if prediction == 'good':
            return jsonify({'status': 'good', 'message': '이 URL은 안전합니다'})
        elif prediction == 'bad':
            return jsonify({'status': 'bad', 'message': '이 URL은 보안 위험이 있을 수 있습니다'})
        
    except Exception as e:
        return jsonify({'status': 'error', 'message': f'예측 중 오류 발생: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(debug=True)

