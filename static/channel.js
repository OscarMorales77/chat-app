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

    // the callback function for socket.on is the lamda function  that is called once the socket is connected
    //further, there is another lamnda function "onsubmit"
    socket.on('connect', () => {
        console.log("working ");
        //join a "room" with the unique location.pathname (JS method) name
        socket.emit('join', { 'room':location.pathname }); // notice how we are calling emit(); right away
        var message;
        document.querySelector('#messageForm').onsubmit = () => {
            message = document.querySelector('#formInput').value;
            console.log(message);

            //location.pathname will always be unique
            //pass to the socket "data" as parameter in this case a JSON object
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
    //this is when the server send a message to socket "client message"
    socket.on('client message', data => {
        // console.log("the data content is")
        // console.log(data)
        // console.log(data.test)
        const li = document.createElement('li');
        li.innerHTML = `Your mesage is: ${data.serverOut}`; //data.serverOut grams that json key "serverOUt"
        document.querySelector('#messages').append(li);
    });


});
