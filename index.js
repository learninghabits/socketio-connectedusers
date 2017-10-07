var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

var rooms = [
    'Room 1',
    'Room 2',
    'Room 3',
    'Room 4'
];

io.on('connection', function (socket) {    
    socket.on('disconnect', function () {
        socket.leaveAll();
        console.log('user disconnected');
    });

    socket.on('chat message', function (msg) {
        console.log('message: ' + msg.room);
        console.log('message: ' + msg.message);
        io.to(msg.room).emit('chat message', msg.message);
    });

    socket.on('join room', function (room) {
        socket.leaveAll();
        socket.join(room);
    });

    socket.emit('available rooms', rooms);
});

var port = process.argv.slice(2)[0] || (process.env.PORT || 8080);
http.listen(port, function () {
	console.log("SERVER IS LISTENING ON PORT: " + port);
	console.log("CTRL+C TO STOP ");
});

process.on('SIGINT', function () {	
	console.log('BYE BYE, STOPPED GRACIOUSLY!');
	process.exit();
});
