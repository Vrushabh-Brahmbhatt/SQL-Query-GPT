import mysql.connector
from colorama import init, Fore, Style
import requests
import getpass
import json
import sys
import os

# Initialize Colorama
init(autoreset=True)  # Autoreset for cleaner code

def get_mysql_credentials():
    """Prompt the user for MySQL credentials."""
    print(Fore.CYAN + "\n=== MySQL Connection Setup ===" + Style.RESET_ALL)
    host = input(Fore.CYAN + "Enter MySQL host (default: localhost): " + Style.RESET_ALL) or "localhost"
    user = input(Fore.CYAN + "Enter MySQL username (default: root): " + Style.RESET_ALL) or "root"
    password = getpass.getpass(Fore.CYAN + "Enter MySQL password: " + Style.RESET_ALL)
    return host, user, password

def connect_to_mysql():
    """Connect to MySQL using user-provided credentials."""
    host, user, password = get_mysql_credentials()
    try:
        db = mysql.connector.connect(host=host, user=user, password=password)
        print(Fore.GREEN + "✓ Successfully connected to MySQL!" + Style.RESET_ALL)
        return db
    except mysql.connector.Error as err:
        print(Fore.RED + f"✗ Error: {err}" + Style.RESET_ALL)
        return None

def generate_query(prompt):
    """Send the user's prompt to the Flask backend to generate the SQL query."""
    print(Fore.CYAN + f"\nGenerating query for: '{prompt}'" + Style.RESET_ALL)
    try:
        response = requests.post(
            "http://127.0.0.1:5000/generate-query",
            json={"prompt": prompt},
            headers={"Content-Type": "application/json"}
        )
        
        # Check if request was successful
        if response.status_code != 200:
            print(Fore.RED + f"Error: API returned status code {response.status_code}" + Style.RESET_ALL)
            return None
            
        response_data = response.json()
        if "query" in response_data:
            query = response_data["query"]
            print(Fore.GREEN + f"\nGenerated Query:" + Style.RESET_ALL)
            print(Fore.WHITE + f"{query}" + Style.RESET_ALL)
            
            # Ask user if they want to execute the query
            confirmation = input(Fore.YELLOW + "\nDo you want to execute this query? (y/n): " + Style.RESET_ALL).strip().lower()
            return query if confirmation == 'y' else None
        else:
            print(Fore.RED + f"Error: {response_data.get('error', 'Unknown error')}" + Style.RESET_ALL)
            return None
    except requests.exceptions.ConnectionError:
        print(Fore.RED + "Error: Cannot connect to the backend server. Make sure it's running." + Style.RESET_ALL)
        return None
    except Exception as e:
        print(Fore.RED + f"Error generating query: {e}" + Style.RESET_ALL)
        return None

def execute_query(cursor, query, values=None):
    """Execute the generated SQL query."""
    try:
        cursor.execute(query, values or ())
        
        if query.strip().lower().startswith(("select", "show", "describe", "explain")):
            results = cursor.fetchall()
            if not results:
                print(Fore.YELLOW + "Query executed successfully. No results returned." + Style.RESET_ALL)
                return
                
            # Get column names
            column_names = [desc[0] for desc in cursor.description]
            
            # Calculate column widths
            col_widths = []
            for i, col in enumerate(column_names):
                # Find maximum width needed for this column
                col_width = max(len(str(col)), 
                               max([len(str(row[i])) for row in results] or [0]) + 2)
                col_widths.append(col_width)
            
            # Print header
            header = " | ".join(f"{col:<{width}}" for col, width in zip(column_names, col_widths))
            print(Fore.CYAN + header + Style.RESET_ALL)
            print(Fore.CYAN + "-" * len(header) + Style.RESET_ALL)
            
            # Print rows
            for row in results:
                formatted_row = " | ".join(f"{str(cell):<{width}}" for cell, width in zip(row, col_widths))
                print(Fore.WHITE + formatted_row + Style.RESET_ALL)
            
            print(Fore.GREEN + f"\n{len(results)} row(s) returned." + Style.RESET_ALL)
        else:
            affected_rows = cursor.rowcount
            print(Fore.GREEN + f"Query executed successfully! {affected_rows} row(s) affected." + Style.RESET_ALL)
            while cursor.nextset():  # Clears remaining results
                pass


    except mysql.connector.Error as err:
        print(Fore.RED + f"Error: {err}" + Style.RESET_ALL)

def use_or_create_database(cursor):
    """Prompt user to select or create a database."""
    cursor.execute("SHOW DATABASES")
    databases = [db[0] for db in cursor.fetchall()]

    print(Fore.CYAN + "\n=== Database Selection ===" + Style.RESET_ALL)
    for i, database in enumerate(databases):
        print(Fore.CYAN + f"{i + 1}. {database}" + Style.RESET_ALL)

    choice = input(Fore.CYAN + "\nSelect a database by number, or type 'new' to create one: " + Style.RESET_ALL).strip().lower()

    if choice == 'new':
        db_name = input(Fore.CYAN + "Enter the name of the new database: " + Style.RESET_ALL).strip()
        cursor.execute(f"CREATE DATABASE {db_name};")
        cursor.execute(f"USE {db_name};")
        print(Fore.GREEN + f"Database '{db_name}' created and selected." + Style.RESET_ALL)
        return db_name
    else:
        try:
            db_name = databases[int(choice) - 1]
            cursor.execute(f"USE {db_name};")
            print(Fore.GREEN + f"Database '{db_name}' selected." + Style.RESET_ALL)
            return db_name
        except (IndexError, ValueError):
            print(Fore.RED + "Invalid selection. Please try again." + Style.RESET_ALL)
            return use_or_create_database(cursor)

def show_help():
    """Display help information."""
    print(Fore.CYAN + "\n=== MySQL Query CLI Help ===" + Style.RESET_ALL)
    print(Fore.WHITE + "- Type natural language descriptions of the SQL queries you want to execute" + Style.RESET_ALL)
    print(Fore.WHITE + "- Special commands:" + Style.RESET_ALL)
    print(Fore.WHITE + "  * 'help': Show this help message" + Style.RESET_ALL)
    print(Fore.WHITE + "  * 'clear': Clear the screen" + Style.RESET_ALL)
    print(Fore.WHITE + "  * 'quit': Exit the application" + Style.RESET_ALL)
    print(Fore.WHITE + "  * 'show tables': Show all tables in the current database" + Style.RESET_ALL)
    print(Fore.WHITE + "  * 'show databases': Show all available databases" + Style.RESET_ALL)
    print(Fore.WHITE + "  * 'use <database>': Switch to another database" + Style.RESET_ALL)
    print("")

def clear_screen():
    """Clear the terminal screen."""
    os.system('cls' if os.name == 'nt' else 'clear')

def main():
    clear_screen()
    print(Fore.GREEN + "╔═══════════════════════════════════════════╗" + Style.RESET_ALL)
    print(Fore.GREEN + "║     MySQL Query CLI with OpenAI GPT       ║" + Style.RESET_ALL)
    print(Fore.GREEN + "╚═══════════════════════════════════════════╝" + Style.RESET_ALL)

    # Connect to MySQL
    db = connect_to_mysql()
    if not db:
        print(Fore.RED + "Failed to connect to MySQL. Exiting..." + Style.RESET_ALL)
        sys.exit(1)

    cursor = db.cursor()

    # Allow user to select or create a database
    current_db = use_or_create_database(cursor)

    # Show help on startup
    show_help()

    while True:
        try:
            prompt = input(Fore.GREEN + f"\n[{current_db}]> " + Style.RESET_ALL).strip()

            if prompt.lower() == 'quit':
                print(Fore.GREEN + "Goodbye!" + Style.RESET_ALL)
                break
            elif prompt.lower() == 'help':
                show_help()
            elif prompt.lower() == 'clear':
                clear_screen()
            elif prompt.lower() == 'show tables':
                execute_query(cursor, "SHOW TABLES;")
            elif prompt.lower() == 'show databases':
                execute_query(cursor, "SHOW DATABASES;")
            elif prompt.lower().startswith('use '):
                db_name = prompt[4:].strip()
                try:
                    cursor.execute(f"USE {db_name};")
                    current_db = db_name
                    print(Fore.GREEN + f"Switched to database '{db_name}'." + Style.RESET_ALL)
                except mysql.connector.Error as err:
                    print(Fore.RED + f"Error: {err}" + Style.RESET_ALL)
            else:
                query = generate_query(prompt)
                if query:
                    execute_query(cursor, query)
        except KeyboardInterrupt:
            print(Fore.YELLOW + "\nOperation cancelled. Type 'quit' to exit." + Style.RESET_ALL)
        except Exception as e:
            print(Fore.RED + f"Error: {e}" + Style.RESET_ALL)

    # Clean up
    if db and db.is_connected():
        cursor.close()
        db.close()

if __name__ == "__main__":
    main()

    