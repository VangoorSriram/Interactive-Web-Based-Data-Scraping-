from flask_jwt_extended import JWTManager, create_access_token
from werkzeug.security import generate_password_hash, check_password_hash
from database import get_db_connection

def configure_auth(app):
    app.config['JWT_SECRET_KEY'] = 'your-secret-key-here'
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)
    return JWTManager(app)

def register_user(username, password):
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO users (username, password_hash) VALUES (%s, %s)",
            (username, generate_password_hash(password))
        )
        conn.commit()
        return True
    except Exception as e:
        print(f"Registration error: {e}")
        return False
    finally:
        conn.close()

def authenticate_user(username, password):
    conn = get_db_connection()
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute(
            "SELECT * FROM users WHERE username = %s",
            (username,)
        )
        user = cursor.fetchone()
        if user and check_password_hash(user['password_hash'], password):
            return create_access_token(identity=user)
        return None
    finally:
        conn.close()
