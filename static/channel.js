document.addEventListener('DOMContentLoaded', function () {
    localStorage.setItem('lastChannel', document.URL);
    //send a ajax request to the server when the user visits the channel for the first time
    const request = new XMLHttpRequest();
    request.open('POST', location.pathname);
    const data = new FormData();
    data.append('userName', localStorage.getItem('userName'));
    request.send(data);
    document.querySelector('span').innerHTML = `Hi, ${localStorage.getItem('userName')}`;


    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);
    console.log("your out is " + location.protocol + '//' + document.domain + ':' + location.port);
    var recepient = 'all'
    console.log('current recpepient  ' + recepient);

    function createButtons() {
        document.querySelectorAll('.currentUsers').forEach(button => {
            button.onclick = () => {
                recepient = button.dataset.user;
                console.log(recepient);
            };
        });
    }
    createButtons();
    // the callback function for socket.on is the lamda function  that is called once the socket is connected
    //further, there is another lamnda function "onsubmit"
    socket.on('connect', () => {
        console.log("working ");
        //join a "room" with the unique location.pathname (JS method) name
        socket.emit('join', { 'room': location.pathname, 'user': localStorage.getItem('userName')}); // notice how we are calling emit(); right away
        var message;
        document.querySelector('#messageForm').onsubmit = () => {
            message = document.querySelector('#formInput').value;
            if (recepient === 'all') {
                socket.emit('server message', { 'message': message, 'room': location.pathname });
                return false;
            } else {
                socket.emit('private message', { 'message': message, 'recepient': recepient});
                return false;
            }

        }
    });

    console.log("does not wait")

    //this is when the server sends a message to socket "client message"
    socket.on('client message', data => {
        const li = document.createElement('li');
        li.innerHTML = `Your mesage is: ${data.serverOut}`; //data.serverOut grams that json key "serverOUt"
        document.querySelector('#messages').append(li);
    });

    socket.on('new user', data => {
        console.log("new user is "+data.newUser)
        console.log("current user is  "+localStorage.getItem('userName'))
        if (data.newUser!=localStorage.getItem('userName')) {
            const post_template = Handlebars.compile(document.querySelector('#selectionTemplate').innerHTML);
            const post = post_template({'content': data.newUser});
            document.querySelector('#channelUsers').innerHTML += post;

            createButtons();
        }


    });


});
