var http = require("http");
var url = require("url");
var io;

function start(route, handle) {

	HTTP_PORT = 8888;

	//HTTP Server for GUI 
	function onRequest(request, response) {
		var postData = "";
		//which URL path the browser requested
		var pathname = url.parse(request.url).pathname;

		if (pathname == "/uploadFile") {
			handle["/uploadFile"](response, request);
		} else {
			//console.log("Request for " + pathname + " received.");

			request.setEncoding("utf8");

			//event listener for the “data” event which step by step fills our new postData variable whenever a new chunk of POST data arrives
			request.addListener("data", function(postDataChunk) {
				postData += postDataChunk;
				// console.log("Received POST data: '" +
				// 	postDataChunk + "'.");
			});

			request.addListener("end", function() {
				//call router
				route(handle, pathname, response, postData);
			});
		}

	}

	var server = http.createServer(onRequest).listen(HTTP_PORT);
	console.log("Http-Server started...");


	/*	var io = require('socket.io').listen(server);
	io.sockets.on('connection', function (socket) {
	  	socket.emit('news', { hello: 'world' });
	  	socket.on('my other event', function (data) {
	    	console.log(data);
	  	});
	});
*/

	//--------------------------------------------------------------------//
	//IO for Connection
	io = require('socket.io').listen(server);

	io.set('log level', 0);

	io.sockets.on('connection', function(socket) {
		console.log("IO connection :)");

		socket.emit('connected', 'connection established');

		/*var data = "my very good data";	  	
    	var address = udpServer.address();
    	console.log("The adress is "+address);
    	var client = dgram.createSocket("udp4");
    	var message = new Buffer(data);
    	client.send(message, 0, message.length, address.port, address.address, function(err, bytes) {
      		client.close();
    	});*/

	});


	//--------------------------------------------------------------------//
	/*//UDP server for display of results
	var UDP_PORT = 33333;
	var HOST = '127.0.0.1';

	var dgram = require('dgram');

	//Creates a datagram Socket of the specified types. Valid types are udp4 and udp6.
	var udpServer = dgram.createSocket('udp4');

	udpServer.on("error", function (err) {
	  	console.log("server error:\n" + err.stack);
	 	server.close();
	});

	//server is initialized + ready to receive UDP packages
	udpServer.on('listening', function () {
	    var address = udpServer.address();
	    console.log('UDP Server listening on ' + address.address + ":" + address.port);
	});

	//message event occurs when a upd package is sent to this server
	udpServer.on('message', function (message, remote) {
	    console.log(remote.address + ':' + remote.port +' - ' + message);

	});

	//bind socket to port
	udpServer.bind(UDP_PORT, HOST);*/
}

function getIo() {
	console.log("io is " + io);
	return io;
}

exports.start = start;
exports.getIo = getIo;