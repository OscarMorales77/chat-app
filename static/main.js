var set1 = new Set(); //using a Set Data Structure to prevent duplicate channel creations

document.addEventListener('DOMContentLoaded', function () {
    document.querySelector('span').innerHTML = `Hi, ${localStorage.getItem('userName')}`;
    //if the server already has exsiting channels, add them to the Set Data Structure
    document.querySelectorAll('.anchorChannel').forEach(elementA => { set1.add(elementA.textContent) });

    document.querySelector('#channelForm').onsubmit = create;
});


function create() {
    newChannelName = document.querySelector('#formValue').value;
    //if the channel is not on the server (i.e in the Set add it)
    if (!set1.has(newChannelName)) {
        const listItem = document.createElement('li');
        const anchorItem = document.createElement('a');
        // use the backtick string formating like python
        anchorItem.setAttribute('href', `/channel/${document.querySelector('#formValue').value}`);
        anchorItem.innerHTML = document.querySelector('#formValue').value;
        // check if regular append workds : TO DO!
        listItem.appendChild(anchorItem);
        document.querySelector('#items').append(listItem);
        // so that the form is not submitted
        set1.add(newChannelName)
    } else {
        //Alert the user the channel already exists with Handle Bars template system
        const post_template = Handlebars.compile(document.querySelector('#alertTemplate').innerHTML);
        const post = post_template();
        document.querySelector('#alert').innerHTML += post;

    }

    return false;
}



