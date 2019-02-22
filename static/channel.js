var recepient = 'all';
document.addEventListener('DOMContentLoaded', function () {

    setAttributes();
  
    createButtons();

    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);
 
    socket.on('connect', () => {
        //join a "room" with the unique location.pathname (JS method) name
         // Join a room immediately after establishing connection to the socket
        socket.emit('join', { 'room': location.pathname, 'user': localStorage.getItem('userName') });
        let message;
        document.querySelector('#messageForm').onsubmit = () => {
            message = document.querySelector('#formInput').value;
            if (recepient === 'all') {
                console.log("too all")
                console.log("current recepient is "+ recepient)
                socket.emit('server message', { 'message': message, 'room': location.pathname });
                return false;
            } else {
                console.log("privae message")
                socket.emit('private message', { 'message': message, 'recepient': recepient });
                return false;
            }

        }
    });

    //message from server
    socket.on('client message', data => {
        const li = document.createElement('li');
        li.innerHTML = `Your mesage is: ${data.serverOut}`; 
        document.querySelector('#messages').append(li);
    });

    //whenever a new user enters a room update the current users list  with handle bars template
    socket.on('new user', data => {
        if (data.newUser != localStorage.getItem('userName')) {
            const post_template = Handlebars.compile(document.querySelector('#selectionTemplate').innerHTML);
            const post = post_template({ 'content': data.newUser });
            document.querySelector('#channelUsers').innerHTML += post;
            createButtons();
        }
    });


});


function setAttributes() {
    document.querySelector('span').innerHTML = `Hi, ${localStorage.getItem('userName')}`;
    localStorage.setItem('lastChannel', document.URL);
    const request = new XMLHttpRequest();
    request.open('POST', location.pathname);
    const data = new FormData();
    data.append('userName', localStorage.getItem('userName'));
    request.send(data);
}

function createButtons() {
    document.querySelectorAll('.currentUsers').forEach(button => {
        button.onclick = () => {
            recepient = button.dataset.user;
            console.log(recepient);
        };
    });
}