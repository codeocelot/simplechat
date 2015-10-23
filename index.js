var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
	  res.sendFile(__dirname + '/index.html');
});

var usersOnline  = [];

io.on('connection', function(socket){
		usersOnline.push(socket.id);
		//socket.broadcast.emit('a ');
		console.log(socket.id + " has joined");
		socket.emit('users',usersOnline);
		console.log("CONNECT: " + usersOnline.length + " currently");
		socket.on('connect',function(){
			console.log('i have connected');
			socket.emit('users',usersOnline);	
		})

		socket.on('chat message',function(msg){
			socket.broadcast.emit('chat message',msg);
		})
		socket.on('writing',function(name){
			socket.broadcast.emit('writing',name);
		})
		socket.on('disconnect',function(){
			var i = usersOnline.indexOf(socket.id);
			console.log(socket.id + "has been disconnected");
			if(usersOnline.indexOf(socket.id) >-1){
				console.log('user found,currently contain ', usersOnline);
				usersOnline.splice(i,1);
			console.log("DISCONNECT: " + usersOnline.length + " remaining");
				socket.emit('users',usersOnline);
			}
		})
});

http.listen(3000, function(){
	console.log('listening on *:3000');
});
