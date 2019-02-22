var set1 = new Set();

document.addEventListener('DOMContentLoaded', function () {
    document.querySelector('span').innerHTML = `Hi, ${localStorage.getItem('userName')}`;

    document.querySelectorAll('.anchorChannel').forEach( elementA => { set1.add(elementA.textContent)});
    console.log(set1.values)
    document.querySelector('#channelForm').onsubmit= create;
});


function create() {
    newChannelName=document.querySelector('#formValue').value;
    console.log("channel is "+ document.querySelector('#formValue').value);
    console.log(set1.has(newChannelName))
    if (!set1.has(newChannelName)) {
        console.log("in the  ifffffffffffff");
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

        const post_template = Handlebars.compile(document.querySelector('#alertTemplate').innerHTML);
        const post = post_template();
        document.querySelector('#alert').innerHTML += post;
        console.log("alredy in the list")
    }
    
    console.log("end of function call")
    return false;
}



