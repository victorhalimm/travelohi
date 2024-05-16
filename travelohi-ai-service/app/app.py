from flask import Flask, request, jsonify
from keras.models import load_model
from keras.preprocessing import image
import numpy as np
from PIL import Image
from flask_cors import CORS

app = Flask(__name__);

CORS(app, resources={r"/predict": {"origins": "http://localhost:5173"}})

# Load the model
model = load_model('model/AlexNet_without_unlabeled.h5')

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return "No file part", 400
    file = request.files['file']
    if file.filename == '':
        return "No selected file", 400
    if file:
        # Convert the file to a PIL Image
        img = Image.open(file.stream).convert('RGB')

        # Preprocess the image
        img = img.resize((224, 224))
        img_array = np.array(img) / 255.0
        img_array = np.expand_dims(img_array, axis=0) 

        # Make prediction
        prediction = model.predict(img_array)
        predicted_class = np.argmax(prediction, axis=1)

        class_name = map_class_to_name(predicted_class[0])

        return jsonify({"class": class_name, "confidence": float(np.max(prediction))})

def map_class_to_name(class_id):
    classes = ['Brazil', 'Canada', 'Finland', 'Japan', 'United Kingdom', 'United States']
    return classes[class_id]

if __name__ == '__main__':
    app.run(debug=True)
