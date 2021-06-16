



   var socket = io();
   let user;
   function setUser() {
      socket.emit('saveUserData',{name:"jeffrey", age:26})
      socket.emit('setUsername', document.getElementById('username').value);
   };

   socket.on('userExists', function(data) {
      document.getElementById('error-container').innerHTML = data;
   });
   socket.on('savedData', function(data) {
      alert(data.savedData.name);
   })

   socket.on('userSet', function(data) {
      user = data.username;
      // attach a new form to DOM for chating 
      document.getElementsByClassName('container')[0].innerHTML = `
      <h4 id="users"></h4>
      <div id = "message-container"></div> 
       <form action="/" id ="form">
      <input type = "text" id = "message"  autocomplete="off">
      <button type = "button" name = "button" onclick = "sendMessage()">Send</button>
      </form>`;  
   });

   socket.on('broadcast', function(data) {  
      if (data.username) {        
         return  document.getElementById('users').innerHTML = data.description +' '+data.username;
      }
      return  document.getElementById('users').innerHTML = data.description;    
   }); 

   function sendMessage() {
      var msg = document.getElementById('message');
      if (msg.value) {
         socket.emit('msg', {message: msg.value, user: user});
         msg.value ='';
         msg.focus();
      }
   }
   socket.on('newmsg', function(data) {
      if (user) {
         document.getElementById('message-container').innerHTML += `<div><b> 
         ${data.user} </b>:  ${data.message} </div>`
      }
   });