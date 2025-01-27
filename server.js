const express = require('express')
const http  = require('http');
const socketIo = require('socket.io');

const app = express();

//create a http server

const server = http.createServer(app);

//INTIATE SOCKETIO AND ATTACH TO HTTP SERVER\
const io = socketIo(server);

const users = new Set();

io.on("connection",(socket) =>{
    console.log("A user is now connected");

//HANDLES WHEN A USER WILL JOIN
socket.on('join',(username)=>{
    users.add(username); //add user to the users list
    socket.username = username;
    //BROADCAST TO ALL CLINET/USERS ABOUT NEW USER JOINED
    io.emit('userJoined',username);

    //send updated users list
    io.emit('userslist',Array.from(users));
})
//HANDLES INCOMING CHAT MESSAGE
socket.on("chatMessage",(message)=>{
    console.log("mesage Recived",message); //debug
    
    io.emit("chatMessage",message); //this will emit back the message for all users
});

//HANDLE THE DISCONNECTION OF USER
socket.on("disconnect",()=>{
    console.log("An user is disconnect");
    
    users.forEach(user =>{
        if(user === socket.username){
            users.delete(user);

            //emit the broad for the main html
            io.emit('userleft',user);
            io.emit('userslist',Array.from(users)) //emit the update user list
        }
    })
})

})
//MIDDLEWARE TO READ THE /PUBLIC HTML DOCUMENT 
app.use(express.static('public'));
//LISITEN TO PORT
const PORT =2929
server.listen(PORT,()=>{
    console.log('Server is listining on port 2929')
});