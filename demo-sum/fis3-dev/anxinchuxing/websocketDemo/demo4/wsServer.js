var ws = require("nodejs-websocket");
var PORT = 3000;
var clientCount = 0;

// Scream server example: "hi" -> "HI!!!"
var server = ws.createServer(function (conn) {
	
	clientCount++;
	conn.nickName = 'user' + clientCount;

	var mes = {};
	mes.type = "enter";
	mes.data = 'user' + clientCount;
	broadcast(JSON.stringify(mes));
	// console.log("New connection")
	conn.on("text", function (str) {
		var mes = {};
		mes.type = "message";
		mes.data = conn.nickName + 'says:' + str;
		broadcast(JSON.stringify(mes));

		console.log("Received "+str)
		// conn.sendText(str);
	})
	conn.on("close", function (code, reason) {
		var mes = {};
		mes.type = "leave";
		mes.data = 'user' + clientCount;
		broadcast(JSON.stringify(mes));

		console.log("Connection closed")
	})
	conn.on('error', function(err) {
		// console.log('handle err');
		console.log(err);
	})
}).listen(PORT);
function broadcast(str) {
	server.connections.forEach(function(connection){
		connection.sendText(str);
	})

}
console.log('websocket server listening on port'+ PORT);