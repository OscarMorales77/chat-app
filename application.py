import os
from queue import Queue
from flask import Flask, render_template, request
from flask_socketio import SocketIO, emit, join_room, leave_room

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

# Global Variables
channel_list = set() 
message={} #will store channel messages in a map as it is more effficient

@app.route("/")
def index():
    return render_template("index.html")


@app.route("/channel/")
@app.route("/channel", methods=["POST", "GET"])
def create_join():
    return render_template("main.html", channel_list=channel_list)


@app.route("/channel/<string:name>")
def channel(name):
     # iff the user clicks on the link, then the server will save the channel
    if name not in channel_list:
        channel_list.add(name)
        #associate with every channel a queue where messages will be stored
        message[f'/channel/{name}']=Queue(4)    

    current_Q=message.get(f'/channel/{name}')
    return render_template("channel.html", channel_name=name,stored_messages=list(current_Q.queue))


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


@socketio.on('join')
def on_join(data):
    room = data['room']
    join_room(room)
    

if __name__ == '__main__':
    socketio.run(app, debug=True)
