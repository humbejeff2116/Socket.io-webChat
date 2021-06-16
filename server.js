









const express = require('express');
const app = require('express')();
const logger = require('morgan');
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

const port = process.env.PORT || 8080;

// const mongoDB = 'mongodb://localhost/socket';
// mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true }, (err, conn) => {
//     if (err) {
//         throw err;
//     }
//     console.log(`connection succesful ${conn}`); 
// });
// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'MongoDB connectionnnn error:'));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine' ,'ejs');
app.use(logger('dev'));

app.use('*', ( req, res, next ) => {
    res.locals.currentUser = req.user;
    next();
});
app.use(express.static(path.join(__dirname , 'public')));
app.get('/', (req, res) => res.render('index'));


 let users = [];
function SaveData() {
    let userData = [];
    this.savedata = function(data = {}) {
        userData.push(data)
    }
    this.getuserData = function() {
        return userData;
    }
}
let userDataStructure =  new savedata();
 app.locals.users = users;
 let onlineUsers = 0;
 io.on('connection', function(socket) {
    console.log('connection established');
    onlineUsers++
    socket.broadcast.emit('broadcast', {description: onlineUsers + ' Users online'});


    socket.on('userData', async function(data) {
        await userDataStructure.savedata(data);
    })



    setTimeout(function() {
        socket.emit('broadcast', { 
          description: (onlineUsers === 1) ? 'it seems you are the only person online' : onlineUsers +' Users online'
        });
    }, 5000);



      socket.on('disconnect' ,()=> {
        onlineUsers--;
        socket.broadcast.emit('broadcast', {description:'A user has left'})
        setTimeout(()=>{
          socket.broadcast.emit('broadcast',{description:(onlineUsers === 1)? 'It seems you are the only person online':  onlineUsers +' Users online'});
        },4000)
      }); 
     


    socket.on('msg', function(data) {
      io.sockets.emit('newmsg', data);
    });
 });

app.use((req, res) => {
  res.status(404).render('404')
})
app.use((err, req, res, next) => {
  console.error(err)
  next(err)
})
app.use((err, req, res, next) => {
  res.status(500).send('internal sever error')
})
http.listen(port, ()=> console.log(`app started on port ${port}`));