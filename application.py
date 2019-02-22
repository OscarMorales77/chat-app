import os
from queue import Queue
from flask import Flask, render_template, request
from flask_socketio import SocketIO, emit, join_room, leave_room

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

# Global Variables
channel_list = set() 
message={} #a map that links a channel name to a Queue ADT
channel_users={}# for every channel associate with it a set that will have all current users
users_sid={}#allows private messages by linking session ID of the connection to the respective user
@app.route("/")
def index():
    return render_template("index.html")


@app.route("/channel/")
@app.route("/channel", methods=["POST", "GET"])
def create_join():
    return render_template("main.html", channel_list=channel_list)


def add_user_channel(name,userName):
    if name in channel_users:
        channel_users.get(name).add(userName)
    else:
        channel_users[name]=set([userName])


# iff the user clicks on the link, then the server will save the channel
@app.route("/channel/<string:name>", methods=["POST", "GET"])
def channel(name):
    if request.method == "POST":
        print("post method is called")
        userName = request.form.get("userName")
        print(userName)
        add_user_channel(name,userName)
        return 'ok'

    if name not in channel_list:
        channel_list.add(name)
        #associate with every channel a queue where messages will be stored
        message[f'/channel/{name}']=Queue(4)    

    current_Q=message.get(f'/channel/{name}')
    print(channel_users.get(name))
    return render_template("channel.html", channel_name=name,stored_messages=list(current_Q.queue),users=channel_users.get(name))


# this will accept a json object
@socketio.on("server message")
def process_message(data):
    print("-------->SID of client "+request.sid)
    selection = data["message"]
    room=data["room"]
    current_Q=message.get(room)
    if current_Q.full():
        current_Q.get() #remove the oldest message
        current_Q.put(selection) #insert a new message
    else:
       current_Q.put(selection) 
    # print("------------>after selection  " +room)
    # print("you message from client "+selection)
    # print("----------->"+room)
    # print(list(current_Q.queue))
    # print(type(list(current_Q.queue)))
    emit("client message", {"serverOut": selection,'test':'just a test'}, room=room)

# this will accept a json object
@socketio.on("private message")
def private_message(data):
    selection = data["message"]
    room=users_sid.get(data['recepient']) #get the sid of the recepient
    emit("client message", {"serverOut": selection}, room=room)


@socketio.on('join')
def on_join(data):
    users_sid[data['user']]=request.sid
    print(f"-----------> {data['user']}  : {request.sid}")
    room=data["room"]
    join_room(room)
    emit("new user", {"newUser": data['user']}, room=room)

if __name__ == '__main__':
    socketio.run(app, debug=True)
