



   var socket = io();
   // set username for chat
   function setUser() {
      socket.emit('setUsername', document.getElementById('username').value);
   };
   // variable to store user
   var user;
   // display data(error message) if user already exist
   socket.on('userExists', function(data) {
      document.getElementById('error-container').innerHTML = data;
   });
   // if a new user you initalize user variable with data(username)
   socket.on('userSet', function(data) {
      user = data.username;
      // attach a new form to the DOM for chatting 
      document.getElementsByClassName('container')[0].innerHTML = `
      <h4 id="users"></h4>
      <div id = "message-container"></div> 
       <form action="" id ="form">
      <input type = "text" id = "message"  autocomplete="off">
      <button type = "button" name = "button" onclick = "sendMessage()">Send</button>
      </form>`; 
      
   });

   // 

   socket.on('broadcast', function(data){  
      if(data.username){        
        return  document.getElementById('users').innerHTML = data.description +' '+data.username;
      }
        return  document.getElementById('users').innerHTML = data.description;    
      }); 
   //  send message function
   
   function sendMessage() {
      var msg = document.getElementById('message');
      if(msg.value) {
         socket.emit('msg', {message: msg.value, user: user});
         msg.value ='';
         msg.focus();

      }
   }
   socket.on('newmsg', function(data) {
      if(user) {
         document.getElementById('message-container').innerHTML += '<div><b>' + 
            data.user + '</b>: ' + data.message + '</div>'
      }
   })

 





  

   































// function submit(){
//   var socket = io();
//   let form = document.getElementById('form');
//   let sentMessage = document.getElementById('m');
//   let displayMessage = document.getElementById('messages');
//   let onlineUsers = document.getElementById('users');
 


 

  
//       form.onsubmit = function(e){
//           e.preventDefault();
        
//           socket.emit('chat message' ,{message: sentMessage.value });
//           sentMessage.value =''
//           return false;

//       } 
    
      
//       socket.on('chat message', function(data){
         
      
//             let messsageArea =document.createElement('li');
//             messsageArea.textContent = '@'+ data.username + ': '+data.message 
//             displayMessage.append(messsageArea)

          
      
//     });
//   
//     socket.on('newUser' ,(data)=>{
//         user = data.username;
    
//    }); 


// }

// submit();



  
  