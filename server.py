from flask import Flask, request, jsonify
from flask_cors import CORS
import sys
import os

# Add parent directory to path to import from src
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'GridSense'))

from src.predict_bill import predict_energy_bill

app = Flask(__name__)
CORS(app)

@app.route('/predict', methods=['POST'])
def predict():
    """
    Endpoint to predict energy bill and provide recommendations
    """
    try:
        user_input = request.get_json()
        
        # Validate required fields
        required_fields = ['home_size_sqft', 'residents', 'climate']
        for field in required_fields:
            if field not in user_input:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Call the prediction function from your backend
        result = predict_energy_bill(user_input)
        
        return jsonify(result), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({'status': 'ok'}), 200

if __name__ == '__main__':
    print("🚀 GridSense Backend Server Starting...")
    print("📍 Server running on http://localhost:5000")
    print("🔗 Frontend should connect to this server")
    app.run(debug=True, host='0.0.0.0', port=5000)
