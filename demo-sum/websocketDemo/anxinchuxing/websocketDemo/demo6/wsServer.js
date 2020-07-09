var app = require('http').createServer();
var io = require('socket.io')(app);
var PORT = 3000;
var clientCount = 0;
app.listen(PORT);
io.on('connection', function(socket) {
	clientCount++;
	socket.nickName = 'user' + clientCount;
	io.emit('enter', socket.nickName + 'come in');    // io.emit() 广播 socket.emit() 发送消息
	socket.on('message', function(str) {
		io.emit('message', socket.nickName + 'says:' + str)
	});
	socket.on('disconnect', function() {
		io.emit('leave', socket.nickName + 'leave');
	});
});
console.log('websocket server listening on port'+ PORT);