document.addEventListener('DOMContentLoaded',function (){
    
   document.querySelector('#channel').onsubmit=create;


});

function create(){

    const listItem= document.createElement('li');
    const anchorItem= document.createElement('a');
    anchorItem.setAttribute('href',`/channel/${document.querySelector('#inputValue').value}`);
    anchorItem.innerHTML=document.querySelector('#inputValue').value;
    listItem.appendChild(anchorItem);
    document.querySelector('#items').append(listItem);
    return false;
}


