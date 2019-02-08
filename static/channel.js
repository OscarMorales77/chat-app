document.addEventListener('DOMContentLoaded', function () {

    localStorage.setItem('lastChannel', document.URL);

    document.querySelector('span').innerHTML = `Hi, ${localStorage.getItem('userName')}`;

    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);
    console.log("your out is " + location.protocol + '//' + document.domain + ':' + location.port);

    // the callback function for socket.on is the lamda function  that is called once the socket is connected
    //further, there is another lamnda function "onsubmit"
    socket.on('connect', () => {
        console.log("working ");

        var message;
        document.querySelector('#messageForm').onsubmit = () => {
            message = document.querySelector('#formInput').value;
            console.log(message);
            //location.pathname will always be unique
            socket.emit('join', { 'room':location.pathname });

            socket.emit('server message', { 'message': message,'room':location.pathname });
            return false;
        }



    });

    console.log("does not wait")
    /*
    document.querySelector('#messageForm').onsubmit = () => {
        var message = document.querySelector('#formInput').value;
        console.log(message);
        socket.on('connect', () =>  {
            console.log("working "+message)
            socket.emit('server message', { 'message': message });
        });


        return false;
    }

      // When  the server emmits a message, add to the unordered list
      socket.on('client message', data => {
        const li = document.createElement('li');
        li.innerHTML = `Your mesage is: ${data.serverOut}`;
        document.querySelector('#messages').append(li);
    });

    */

    socket.on('client message', data => {
        
        const li = document.createElement('li');
        li.innerHTML = `Your mesage is: ${data.serverOut}`;
        document.querySelector('#messages').append(li);
    });


});
