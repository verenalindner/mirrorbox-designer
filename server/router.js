
var path = require('path');

function route(handle, pathname, response, postData) {
	console.log("Request: " + pathname);

	//console.log("will handle "+handle[pathname])

	var basename = path.basename(pathname);
	
	//check if it is a request for a fileresource
	if (basename.length != 0 && basename.indexOf("\.") > -1) {
		//"Please, handle this pathname"
		handle["/loadResource"](response, pathname);
	}

	//check if a request handler for the given pathname exists, and if it does, we simply call the according function
	else if (typeof handle[pathname] === 'function') {
		//"Please, handle this pathname"
		handle[pathname](response, postData);
	} else {
		console.log("No request handler found for " + pathname);
		response.writeHead(404, {"Content-Type": "text/plain"});
		response.write("404 Not found");
		response.end();
	}
}
exports.route = route;