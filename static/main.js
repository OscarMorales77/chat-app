document.addEventListener('DOMContentLoaded', function () {
    document.querySelector('span').innerHTML = `Hi, ${localStorage.getItem('userName')}`;
    document.querySelector('#channelForm').onsubmit = create;


});

function create() {

    const listItem = document.createElement('li');
    const anchorItem = document.createElement('a');
    // use the backtick string formating like python
    anchorItem.setAttribute('href', `/channel/${document.querySelector('#formValue').value}`);
    anchorItem.innerHTML = document.querySelector('#formValue').value;
    listItem.appendChild(anchorItem);
    document.querySelector('#items').append(listItem);
    // so that the form is not submitted
    return false;
}


