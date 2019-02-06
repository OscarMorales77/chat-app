import os

from flask import Flask, render_template
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

# Global Variables
channel_list = []


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/channel/")
@app.route("/channel", methods=["POST", "GET"])
def create_join():
    return render_template("main.html", channel_list=channel_list)


@app.route("/channel/<string:name>")
def channel(name):
    channel_list.append(name)
    return render_template("channel.html", channel_name=name)


if __name__ == '__main__':
    socketio.run(app, debug=True)
