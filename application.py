import os
from queue import Queue
from flask import Flask, render_template, request
from flask_socketio import SocketIO, emit, join_room

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

# Global Variables
channel_list = set()
message = {}  # a map that links a channel name to a Queue ADT
channel_users = {}  # for every channel associate with it a set that will have all current users
users_sid = {}  # allows private messages by linking session ID of the connection to the respective user


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/channel/")
@app.route("/channel", methods=["POST", "GET"])
def create_join():
    return render_template("main.html", channel_list=channel_list)

#helper function see below
def add_user_channel(name, userName):
    if name in channel_users:
        channel_users.get(name).add(userName)
    else:
        channel_users[name] = set([userName])


# iff the user clicks on the link, then the server will save the channel
@app.route("/channel/<string:name>", methods=["POST", "GET"])
def channel(name):
    if request.method == "POST": # handles adding a user to a given page via ajax request 
        userName = request.form.get("userName")
        add_user_channel(name, userName) #helper function to check if the user has already visted the current room and set
        return 'ok' 

    if name not in channel_list:
        channel_list.add(name)
        # associate with every channel a queue where messages will be stored
        message[f'/channel/{name}'] = Queue(100)

    current_Q = message.get(f'/channel/{name}')
    return render_template("channel.html", channel_name=name, stored_messages=list(current_Q.queue), users=channel_users.get(name))


# handle incoming and outgoing messages that are not private
@socketio.on("server message")
def process_message(data):
    selection = data["message"] # based on the json object passed by the client
    room = data["room"]
    current_Q = message.get(room) #get the Queue Data Structure associated with this room
    if current_Q.full():
        current_Q.get()  # remove the oldest message
        current_Q.put(selection)  # insert a new message
    else:
        current_Q.put(selection)
    emit("client message", {"serverOut": selection}, room=room)

#handles private communication between users
@socketio.on("private message")
def private_message(data):
    selection = data["message"]
    room = users_sid.get(data['recipient'])  # get the sid of the recipient
    room2 = users_sid.get(data['sender']) #send the message to the recipient also for private communications
    emit("client message", {"serverOut": selection}, room=room)
    emit("client message", {"serverOut": selection}, room=room2)

#join a room and save the SID of the user, the sid is always different for every session, so must be updated everything a connection is made
@socketio.on('join')
def on_join(data):
    users_sid[data['user']] = request.sid #put key-value pair (username and sid) into dictionary
    room = data["room"]
    join_room(room)
    emit("new user", {"newUser": data['user']}, room=room) #emit a new message so that the current users list can be updated via JavaScript code


if __name__ == '__main__':
    socketio.run(app, debug=True)
