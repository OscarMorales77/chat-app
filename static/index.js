document.addEventListener('DOMContentLoaded', function () {

  if (localStorage.getItem('lastChannel') === null && localStorage.getItem('userName')=== null) {
    document.querySelector('#formName').onsubmit = () => {
      if (localStorage.getItem('userName') === null) {
        //localStorage.clear;
        let userName = document.querySelector('#userName').value;
        localStorage.setItem('userName', userName);
      }
    };
  }
  else if(localStorage.getItem('userName')!= null && localStorage.getItem('lastChannel') === null){
    window.location.replace(location.protocol + "//" + location.host+"/channel")
  }

  else{
    
    window.location.replace(localStorage.getItem('lastChannel'));
  }

});
