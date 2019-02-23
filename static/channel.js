var recipient = 'all';
document.addEventListener('DOMContentLoaded', function () {
    
    setAttributes();

    createButtons();

    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);
 
    socket.on('connect', () => {

        socket.emit('join', { 'room': location.pathname, 'user': localStorage.getItem('userName') });
        let message;
        document.querySelector('#messageForm').onsubmit = () => {
            message=`${localStorage.getItem('userName')}  (${ (new Date()).toUTCString()}):  ${document.querySelector('#formInput').value}`
            document.querySelector('#formInput').value='';
            if (recipient === 'all') {
                socket.emit('server message', { 'message': message, 'room': location.pathname });
                return false;
            } else {
                socket.emit('private message', { 'message': message, 'recipient': recipient,'sender':localStorage.getItem('userName') });
                return false;
            }

        }
    });

    //message from server
    socket.on('client message', data => {
        const li = document.createElement('li');
        li.innerHTML = data.serverOut; 
        document.querySelector('#messages').append(li);
    });

    //whenever a new user enters a room update the current users list  with handle bars template
    socket.on('new user', data => {
        if (data.newUser != localStorage.getItem('userName')) {
            const post_template = Handlebars.compile(document.querySelector('#selectionTemplate').innerHTML);
            const post = post_template({ 'content': data.newUser });
            document.querySelector('#channelUsers').innerHTML += post;
            createButtons();// assign an onclick attribute to every radio button
        }
    });


});


function setAttributes() {
    document.querySelector('span').innerHTML = `Hi, ${localStorage.getItem('userName')}`;
    localStorage.setItem('lastChannel', document.URL);
    // send a ajax request with the user's username via ajax to be stored in the server
    const request = new XMLHttpRequest();
    request.open('POST', location.pathname);
    const data = new FormData();
    data.append('userName', localStorage.getItem('userName'));
    request.send(data);
}

function createButtons() {
    document.querySelectorAll('.currentUsers').forEach(button => {
        button.onclick = () => {
            recipient = button.dataset.user; //change the current recipient
        };
    });
}