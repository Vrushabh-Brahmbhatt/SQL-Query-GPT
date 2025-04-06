import subprocess
import sys
import openai
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS  # Import CORS for handling cross-origin requests

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Store your OpenAI API key securely
# Consider using environment variables in production
openai.api_key = "YOUR_OPENAI_API_KEY"

@app.route("/")
def index():
    """Render the main page."""
    return render_template("index.html")

@app.route('/documentation')
def documentation():
    return render_template('documentation.html')

@app.route('/settings')
def settings():
    return render_template('settings.html')

@app.route("/open-cli", methods=["POST"])
def open_cli():
    """Open the MySQL Query CLI in a new terminal window."""
    try:
        if sys.platform == "win32":  # Windows
            subprocess.Popen(['start', 'cmd', '/k', 'python', 'query.py'], shell=True)
        elif sys.platform == "darwin":  # macOS
            subprocess.Popen(['open', '-a', 'Terminal', 'python3', 'query.py'])
        else:  # Linux
            subprocess.Popen(['gnome-terminal', '--', 'python3', 'query.py'])

        return jsonify({"status": "running", "message": "CLI opened successfully"}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": f"Failed to open CLI: {e}"}), 500

@app.route("/generate-query", methods=["POST"])
def generate_query():
    """Generate an SQL query using the OpenAI API."""
    if not request.is_json:
        return jsonify({"error": "Invalid request format. JSON expected."}), 400
        
    user_prompt = request.json.get("prompt")
    if not user_prompt:
        return jsonify({"error": "No prompt provided"}), 400
        
    try:
        # Update to use the newer client library syntax
        client = openai.OpenAI(api_key=openai.api_key)
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are an expert SQL query generator. Generate only valid SQL syntax without explanations. Return only the SQL code."},
                {"role": "user", "content": f"Generate SQL query for: {user_prompt}"}
            ],
            temperature=0.3
        )
        query = response.choices[0].message.content.strip()

        # Remove Markdown formatting if present
        query = query.replace("```sql", "").replace("```", "").strip()

        return jsonify({"query": query}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/chatbot", methods=["POST"])
def chatbot():
    """Handle chatbot interactions."""
    if not request.is_json:
        return jsonify({"reply": "Invalid request format"}), 400
        
    data = request.json
    user_message = data.get("message", "")
    
    if not user_message:
        return jsonify({"reply": "No message provided"}), 400

    try:
        # Update to use the newer client library syntax
        client = openai.OpenAI(api_key=openai.api_key)
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are an SQL assistant helping users with database operations and MySQL queries. Be concise and helpful."},
                {"role": "user", "content": user_message}
            ],
            temperature=0.7
        )
        reply = response.choices[0].message.content
        return jsonify({"reply": reply})

    except Exception as e:
        return jsonify({"reply": f"Error: {str(e)}"})

if __name__ == "__main__":
    app.run(debug=True)