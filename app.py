from flask import Flask, request, jsonify
from dotenv import load_dotenv
import fitz  # PyMuPDF
from openai import OpenAI
import os
import json
from flask_cors import CORS

#client = OpenAI("OPENAI_API_KEY")

# Load environment variables
load_dotenv()

# Set API key properly for openai module
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

app = Flask(__name__)
CORS(app)

# Extract text from PDF using PyMuPDF
def extract_text_from_pdf(file_stream):
    doc = fitz.open(stream=file_stream.read(), filetype="pdf")
    text = ""
    for page in doc:
        text += page.get_text()
    return text

# Generate flashcards using OpenAI
def generate_flashcards(text):
    prompt = f"""
    Create quiz-style flashcards from the following content:\n\n{text}\n\n
    Output format: JSON list like this:
    [
        {{"question": "What is ...?", "answer": "It is ..."}},
        ...
    ]
    """
    try:
        response = client.chat.completions.create(model="gpt-4",
        messages=[
            {"role": "system", "content": "You're a helpful assistant that makes flashcards."},
            {"role": "user", "content": prompt}
        ],
        max_tokens=1000)

        raw = response.choices[0].message.content

        flashcards = json.loads(raw)
        return flashcards

    except Exception as e:
        print("Error in generate_flashcards:", e)
        return []

# Flask route to handle uploads
@app.route('/upload', methods=['POST'])
def upload_pdf():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files['file']
    text = extract_text_from_pdf(file)
    flashcards = generate_flashcards(text)

    if not flashcards:
        return jsonify({"error": "Failed to generate flashcards."}), 500

    return jsonify({"flashcards": flashcards})

if __name__ == '__main__':
    app.run(debug=True)

