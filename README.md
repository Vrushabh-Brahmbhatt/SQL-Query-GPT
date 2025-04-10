# SQL-Query-GPT
Convert natural language to SQL queries with the power of GPT.

SQL Query GPT bridges the gap between natural language and SQL queries, allowing database interactions without needing to remember complex SQL syntax. Perfect for database beginners, data analysts who aren't SQL experts, or experienced developers looking to speed up their workflow.

Screenshots:
![Screenshot-1](https://github.com/user-attachments/assets/4a0297ef-e6ef-4805-be81-c0ec6af8229a)
![Screenshot-2](https://github.com/user-attachments/assets/38017c15-869a-4b3b-9ef0-3c340d55b336)
![Screenshot-3](https://github.com/user-attachments/assets/30a46288-81db-49d5-99ba-38fb9381f3d0)
![Screenshot-4](https://github.com/user-attachments/assets/2f9562d2-2555-4e6c-b25d-f72727ba3ac6)
![Screenshot-5](https://github.com/user-attachments/assets/dd95d227-cc17-4748-b4b2-30865cb7c21f)
![Screenshot-6](https://github.com/user-attachments/assets/abb71783-9fae-453e-b0f8-0ec38ce297a6)



✨ Features:
1. Natural Language Processing: Convert plain English to executable SQL queries
2. Dual Interface: Web UI and CLI options for different user preferences
3. Interactive Database Management: Connect to MySQL databases and execute generated queries
4. AI Chat Assistant: Get SQL help and explanations through a conversational interface
5. Error Handling: Comprehensive validation with user-friendly error messages

🛠️ Tech Stack:
- Backend: Python, Flask
- Database: MySQL
- AI: OpenAI GPT API
- Frontend: HTML, CSS, JavaScript
- CLI: Python with colorama for formatted terminal output

📋 Prerequisites:
- Python 3.7+
- MySQL database
- OpenAI API key

⚙️ Installation
1. Clone this repository

  `git clone https://github.com/yourusername/sql-query-gpt.git
  cd sql-query-gpt`

2. Install dependencies

  `pip install -r requirements.txt`

3. Create a .env file with your OpenAI API key

  `OPENAI_API_KEY=your_api_key_here`

4. Run the application

  `python open_cli.py`

💻 Usage:

Web Interface
1. Open your browser and navigate to http://localhost:5000
2. Type your natural language query in the input field
3. Click "Generate SQL" to see the corresponding SQL query
4. Connect to your database using the connection form
5. Execute the generated query directly from the web interface

CLI Tool:
1. Launch the CLI tool directly or from the web interface

  `python query.py`

2. Connect to your database when prompted
3. Enter your natural language description
4. Review the generated SQL query
5. Confirm to execute or modify as needed

🔍 Use Cases:
1. Educational Tool: Learn SQL by seeing equivalent SQL for natural language descriptions
2. Productivity Tool: Accelerate database work without memorizing syntax
3. Cross-Team Collaboration: Enable non-technical team members to query databases
4. Data Analysis: Quickly generate and execute SQL queries for data extraction

🚀 Future Improvements:
 1. Support for additional database systems (PostgreSQL, SQLite, etc.)
 2. Query history and favorites storage
 3. User authentication and role-based access control
 4. Enhanced error correction suggestions
 5. Custom fine-tuned model for improved SQL generation

📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
