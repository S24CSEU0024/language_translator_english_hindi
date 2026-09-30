
from flask import Flask, render_template, request, jsonify
from importlib import import_module

try:
    _transformers = import_module("transformers")
    MarianMTModel = _transformers.MarianMTModel
    MarianTokenizer = _transformers.MarianTokenizer
except ImportError as exc:
    raise ImportError(
        "The 'transformers' package is required. Install it with "
        "'pip install transformers torch'."
    ) from exc

# --------------------------------------------------
# 1. Create Flask application
# --------------------------------------------------

app = Flask(__name__)


# --------------------------------------------------
# 2. Load English → Hindi MarianMT model
# --------------------------------------------------

MODEL_NAME = "Helsinki-NLP/opus-mt-en-hi"

print("Loading translation model...")

tokenizer = MarianTokenizer.from_pretrained(MODEL_NAME)
model = MarianMTModel.from_pretrained(MODEL_NAME)

print("✅ Translation model loaded successfully!")


# --------------------------------------------------
# 3. Translation function
# --------------------------------------------------

def translate_sentence(sentence):

    # Remove unnecessary spaces
    sentence = sentence.strip()

    # Check empty input
    if not sentence:
        return ""

    # Convert English text into model-readable tokens
    inputs = tokenizer(
        [sentence],
        return_tensors="pt",
        padding=True,
        truncation=True
    )

    # Generate Hindi translation
    translated = model.generate(
        **inputs,
        max_length=100
    )

    # Convert generated tokens back into Hindi text
    translation = tokenizer.decode(
        translated[0],
        skip_special_tokens=True
    )

    return translation


# --------------------------------------------------
# 4. Home page
# --------------------------------------------------

@app.route("/")
def home():
    return render_template("index.html")


# --------------------------------------------------
# 5. Translation API
# --------------------------------------------------

@app.route("/translate", methods=["POST"])
def translate():

    # Get JSON data sent by JavaScript
    data = request.get_json()

    # Get English sentence
    sentence = data.get("text", "")

    # Translate
    translation = translate_sentence(sentence)

    # Send translation back to browser
    return jsonify({
        "translation": translation
    })


# --------------------------------------------------
# 6. Run Flask server
# --------------------------------------------------

if __name__ == "__main__":
    app.run(debug=True)
