document.addEventListener('DOMContentLoaded', function () {

  if (localStorage.getItem('lastChannel') === null && localStorage.getItem('userName')=== null) {
    document.querySelector('#formName').onsubmit = () => {
      if (localStorage.getItem('userName') === null) { //remove this if statement not needed already checked on top
        //localStorage.clear;
        let userName = document.querySelector('#userName').value;
        localStorage.setItem('userName', userName);
      }
    };
  }
  else if(localStorage.getItem('userName')!= null && localStorage.getItem('lastChannel') === null){
    //if the current sesssion has User Name redirect the user to the "channel" page
    window.location.replace(location.protocol + "//" + location.host+"/channel")
  }

  else{
    //else the session has a username and a last channel
    window.location.replace(localStorage.getItem('lastChannel'));
  }

});
