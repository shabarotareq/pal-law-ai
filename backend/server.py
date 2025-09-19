# server.py
from flask import Flask
from flask_socketio import SocketIO

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

@socketio.on('joinRoom')
def handle_join(data):
    print(f"User {data['userId']} joined room {data['roomId']} as {data['role']}")
    socketio.emit("userUpdate", {"userId": data['userId'], "role": data['role']}, broadcast=True)

if __name__ == "__main__":
    socketio.run(app, debug=True)
