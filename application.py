import os

from flask import Flask, render_template, request
from flask_socketio import SocketIO, emit, join_room, leave_room

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

# Global Variables
channel_list = []


@app.route("/")
def index():
    print("workingx")
    return render_template("index.html")


@app.route("/channel/")
@app.route("/channel", methods=["POST", "GET"])
def create_join():
    return render_template("main.html", channel_list=channel_list)


@app.route("/channel/<string:name>")
def channel(name):
    channel_list.append(name) #iff the user clicks on the link, then the server will save the channel
    return render_template("channel.html", channel_name=name)


#this will accept a json object
@socketio.on("server message")
def vote(data):
    print("-------->before selection")
    selection = data["message"]
    
    print("------------>after selection")
    print("you message from client "+selection)
  
    emit("client message", {"serverOut": selection}, broadcast=True,)

if __name__ == '__main__':
    socketio.run(app, debug=True)
