



// const express = require('express');
const app = require('express')();
const logger = require('morgan');
const bodyParser = require('body-parser');
const http = require('http');
const io = require('socket.io')(http);
const path = require('path');
const port = process.env.PORT || 3000;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine' ,'ejs' );
app.use(logger('dev'));
app.use(express.static(path.join(__dirname , 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.get('/', (req,res)=>{    res.render('index') });

var users = [];
 app.locals.users = users;
 let onlineUsers = 0;
 io.on('connection', function(socket) {
  
    console.log('connection established');
    //recieves username from client and  set username
    socket.on('setUsername', function(data) {
       console.log(data);
       
       if(users.indexOf(data) > -1) {
        // if user exist send a warning message back to the client
          socket.emit('userExists', ` the username  ${data} is taken! Try some other username.`);

       } else {

          onlineUsers++
          console.log('A user connected');
          users.push(data);
          //send user data to the client after username have been set
          socket.emit('userSet', {username: data});
            // send message to new user
          socket.emit('broadcast',{ description: 'Hi, welcome!',username:data});
            // send number of online users after 05 seconds to new user
          setTimeout(function() {
            socket.emit('broadcast',{ description:(onlineUsers === 1)? 'it seems you are the only person online':  onlineUsers +' Users online'});
          }, 5000);
        //  send broadcast to every online user about users online
         socket.broadcast.emit('broadcast', {description: onlineUsers + ' Users online'});
         // user discconnects  
        socket.on('disconnect' ,()=> {
          onlineUsers--;
            // send broadcast to everyone when a user leaves
            socket.broadcast.emit('broadcast', {description:'A user has left'})

          setTimeout(()=>{
            socket.broadcast.emit('broadcast',{description:(onlineUsers === 1)? 'It seems you are the only person online':  onlineUsers +' Users online'});
            },4000)
        
        })
    
       }
    });
      
    // recieves message from client
    socket.on('chat msg', function(data) {
       //Send message to everyone from server
       io.emit('new msg', data);
    });

 });

app.use((req,res)=>{
    res.status(404).render('404')
})
app.use((err,req,res,next)=>{
    console.error(err)
    next(err)
})
app.use((err,req,res,next)=>{
    res.status(500).send('internal sever error')
})

http.createServer(app).listen(port, ()=> console.log(`app has started on port ${port}`));

    //  socket.emit only the current user can see mssg
    // socket.broadcast.emit  every user can see msg
    // io.emit everybody can see msg