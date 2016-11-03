//node-formidable by Felix Geisendoerfer
var querystring = require("querystring"),
	fs = require("fs");
var server = require("./server");
var formidable = require("formidable");

function startHtml(response, postData) {
	fs.readFile('../client/index.html', 'utf8', function(error, data) {
		if (error) {
			response.writeHead(500, {
				"Content-Type": "text/plain"
			});
			response.write(error + "\n");
			response.end();
		} else {
			response.writeHead(200, {
				"Content-Type": "text/html"
			});
			response.write(data);
			response.end();
		}

	});
}

function load(response, postData) {
	console.log("LOADING SESSION!");
	var filename;

	fs.readFile('./tmpUserData.json', 'utf8', function(err, data) {
		if (err) throw err;

		console.log("TMPFILE date is " + data);
		jsondata = eval("(" + data + ")");
		filename = jsondata.currentFile;

		console.log("FILENAME IS " + filename);


		fs.readFile(filename, 'utf8', function(err, data) {
			if (err) throw err;

			response.writeHead(200, {
				"Content-Type": "text/plain"
			});
			response.write(data);
			response.end();


			//todo. for now the clientII will be updated upon save
			var io = server.getIo();
			console.log("io is " + io);
			io.sockets.emit("load", data);

		});
	});
}

function getSessions(response, postData) {
	fs.readdir('./sessions', function(err, files) {
		if (err) throw err;

		var jsonFiles = [];
		for (var i = 0; i < files.length; i++) {
			var session = {};
			session["name"] = files[i];
			jsonFiles.push(session);
		}

		console.log("JsonFiles: " + JSON.stringify(jsonFiles));
		response.writeHead(200, {
			"Content-Type": "text/plain"
		});
		response.write(JSON.stringify(jsonFiles));
		response.end();

	});
}

function setSession(response, postData) {
	fs.readFile('./tmpUserData.json', 'utf8', function(err, data) {
		if (err) throw err;

		//remove \" and \' from sting and set correct filetype
		var filename = postData;
		if (filename.lastIndexOf(".json") < 0) {
			filename = filename + ".json";
		}
		//filename = postData.replace("\"","");
		filename = filename.replace(/"/g, "");
		filename = filename.trim();

		jsondata = eval("(" + data + ")");
		jsondata.currentFile = "./sessions/" + filename;

		fs.writeFile('./tmpUserData.json', JSON.stringify(jsondata), function(err) {
			if (err) throw err;
			response.writeHead(200, {
				"Content-Type": "text/plain"
			});
			response.write("Set session to " + filename + " successfull");
			response.end();
		});

		//only send request if the session is not set as backup
		if (filename.indexOf("InternBackupFile") < 0) {
			var io = server.getIo();
			console.log("new Session io");
			io.sockets.emit("new", data);
		}


		/* 	fs.writeFile(jsondata.currentFile, "", function (err) {
			if (err) throw err;
			response.writeHead(200, {"Content-Type": "text/plain"});
			response.write("Created file at "+postData);
			response.end();
		});	*/


	});
}

//postData should be content
function save(response, postData) {
	console.log("Saving SESSION!")
	console.log("Sent data is " + postData);

	var filename;

	//get the loaction of the currentFile
	fs.readFile('./tmpUserData.json', 'utf8', function(err, data) {
		if (err) throw err;

		jsondata = eval("(" + data + ")");
		filename = jsondata.currentFile;

		console.log("FILENAME IS " + filename);

		fs.writeFile(filename, postData, function(err) {
			if (err) throw err;
			console.log('It\'s saved!');
			response.writeHead(200, {
				"Content-Type": "text/plain"
			});
			response.write("Save of " + filename + " successfull");
			response.end();
		});
	});

	//todo. for now the clientII will be updated upon save
	var io = server.getIo();
	console.log("io is " + io);
	io.sockets.emit("load", postData);

}

function getFoldlerContent(response, postData) {
	var dir;
	switch (postData) {
		case "ui-elements":
			dir = "../client/img/ui-elements";
			break;
		case "ui-icons":
			dir = "../client/img/ui-icons";
			break;
		case "custom-imgs":
			dir = "../client/img/custom-imgs";
			break;
	}

	fs.readdir(dir, function(err, files) {
		if (err) throw err;

		var jsonFiles = [];
		for (var i = 0; i < files.length; i++) {
			var session = {};
			session["name"] = files[i];
			jsonFiles.push(session);
		}

		console.log("JsonFiles: " + JSON.stringify(jsonFiles));
		response.writeHead(200, {
			"Content-Type": "text/plain"
		});
		response.write(JSON.stringify(jsonFiles));
		response.end();
	});
}

function getDefaultShape(response, postData) {
	fs.readFile('./defaultConfig.json', 'utf8', function(err, data) {
		if (err) throw err;

		jsondata = eval("(" + data + ")");
		console.log("postdata is '" + postData + "'. is 'rect' postdata? " + (postData === "rect"));
		console.log(typeof postData);

		console.log("getDefaultShape: data is " + jsondata);

		response.writeHead(200, {
			"Content-Type": "text/plain"
		});
		if (postData == "rect") {
			response.write(JSON.stringify(jsondata.rect));
		} else if (postData == "circle") {
			response.write(JSON.stringify(jsondata.circle));
		} else if (postData == "triangle") {
			response.write(JSON.stringify(jsondata.triangle));
		} else if (postData == "polystar") {
			response.write(JSON.stringify(jsondata.polystar));
		} else if (postData == "text") {
			response.write(JSON.stringify(jsondata.text));
		} else if (postData === "line") {
			response.write(JSON.stringify(jsondata.line));
		} else if (postData == "halfCircle") {
			console.log("halfCircle");
			response.write(JSON.stringify(jsondata.halfCircle));
		}

		/*else if (postData == "img"){
			response.write(JSON.stringify(jsondata.img));
		}*/

		response.end();

	});
}

//postDate will contani the src of the image
function getDefaultImage(response, postData) {
	fs.readFile('./defaultConfig.json', 'utf8', function(err, data) {
		if (err) throw err;

		jsondata = eval("(" + data + ")");
		jsondata.img.image.src = postData;
		console.log("src set to " + postData);
		response.write(JSON.stringify(jsondata.img));
		response.end();
	});
}

function update(response, postData) {
	//todo. for now the clientII will be updated upon save
	var io = server.getIo();
	console.log("io is " + io);
	io.sockets.emit("update", postData);

	response.writeHead(200, {
		"Content-Type": "text/plain"
	});
	response.write("Emitted Update Message to websocket");
	response.end();
}

function add(response, postData) {
	//todo. for now the clientII will be updated upon save
	var io = server.getIo();
	console.log("io is " + io);
	io.sockets.emit("add", postData);

	response.writeHead(200, {
		"Content-Type": "text/plain"
	});
	response.write("Emitted Add Message to websocket");
	response.end();
}

function remove(response, postData) {
	//todo. for now the clientII will be updated upon save
	var io = server.getIo();
	console.log("io is " + io);
	io.sockets.emit("remove", postData);

	response.writeHead(200, {
		"Content-Type": "text/plain"
	});
	response.write("Emitted Remove Message to websocket");
	response.end();
}

function updateElemTransformations(response, postData) {
	var io = server.getIo();
	console.log("io is " + io);
	io.sockets.emit("updateElemTransformation", postData);

	response.writeHead(200, {
		"Content-Type": "text/plain"
	});
	response.write("Emitted Element Transformation Update Message to websocket");
	response.end();
}

function changeDefaultSettings(response, postData) {
	fs.readFile('./tmpUserData.json', 'utf8', function(err, data) {
		if (err) throw err;

		console.log("TMPFILE data is " + data);
		fileJson = eval("(" + data + ")");
		postJson = eval("(" + postData + ")");

		if (postData.color) {
			fileJson.color = postData.color;
		}

		fs.writeFile('./tmpUserData.json', JSON.stringify(fileJson), function(err) {
			if (err) throw err;
			response.writeHead(200, {
				"Content-Type": "text/plain"
			});
			response.write("Color set to " + postData);
			response.end();
		});
	});
}

function getDefaultSettings(response, postData) {
	fs.readFile('./tmpUserData.json', 'utf8', function(err, data) {
		if (err) throw err;
		response.writeHead(200, {
			"Content-Type": "text/plain"
		});
		response.write(data);
		response.end();
	});
}

//creates a new custom shape file - postData is the element in json
function newCustomShape(response, postData) {
	data = eval("(" + postData + ")");

	fs.writeFile("./sessions/customShapes/" + data.name + ".js", postData, function(err) {
		if (err) throw err;
		response.writeHead(200, {
			"Content-Type": "text/plain"
		});

		//TODO send the whoe thing??
		response.write(postData);
		response.end();
	});
}

//gets a customShape (json). postData is the nameof theh customShape
function getCustomShape(response, postData) {
	fs.readFile("./sessions/customShapes/" + postData + ".js", 'utf8', function(err, data) {
		if (err) throw err;
		response.writeHead(200, {
			"Content-Type": "text/plain"
		});
		response.write(data);
		response.end();
	});
}



function uploadFile(response, request) {
	console.log("Request handler 'upload' was called.");
	var form = new formidable.IncomingForm();
	form.uploadDir = "../client/img/custom-imgs";

	var filenames = [];

	form
		.on('error', function(err) {
			response.writeHead(200, {
				'content-type': 'text/plain'
			});
			response.end('error:\n\n' + util.inspect(err));
		})
		.on('file', function(fileId, file) {
			fs.rename(file.path, form.uploadDir + "/" + file.name);
			filenames.push("img/custom-imgs/" + file.name);
		})
		.on('end', function() {
			console.log('-> post done');
			// console.log(allFiles);
			response.writeHead(200, {
				"Content-Type": "text/plain"
			});
			response.write(filenames.toString());
			response.end();
		});

	form.parse(request);
}


/*load resource*/
function loadResource(response, path) {

	if (path.lastIndexOf(".js") > -1) {
		loadJs(response, path);
	} else if (path.lastIndexOf(".css") > -1) {
		loadCss(response, path);
	} else if (path.lastIndexOf(".png") > -1 || path.lastIndexOf(".jpg") > -1 || path.lastIndexOf(".jpeg") > -1 || path.lastIndexOf(".gif") > -1) {
		var parts = path.split(".");
		loadImage(response, path, parts[parts.length - 1]);
	} else if (path.lastIndexOf(".html") > -1) {
		console.log("load html will now be called");
		loadHtml(response, path);
	} else {
		// todo
		console.log("so far unknown file type");
	}
}

function loadJs(response, path) {
	fs.readFile('../client/' + path, 'utf8', function(error, data) {
		if (error) {
			response.writeHead(500, {
				"Content-Type": "text/plain"
			});
			response.write(error + "\n");
			response.end();
		} else {
			response.writeHead(200, {
				"Content-Type": "application/javascript"
			});
			response.write(data);
			response.end();
		}

	});
}

function loadCss(response, path) {

	fs.readFile('../client/' + path, 'utf8', function(error, data) {
		if (error) {
			response.writeHead(500, {
				"Content-Type": "text/plain"
			});
			response.write(error + "\n");
			response.end();
		} else {
			response.writeHead(200, {
				"Content-Type": "text/css"
			});
			response.write(data);
			response.end();
		}

	});

}


function loadHtml(response, path) {
	fs.readFile('../client/' + path, 'utf8', function(error, data) {
		if (error) {
			response.writeHead(500, {
				"Content-Type": "text/plain"
			});
			response.write(error + "\n");
			response.end();
		} else {
			response.writeHead(200, {
				"Content-Type": "text/html"
			});
			response.write(data);
			response.end();
		}

	});

}

function loadImage(response, path, type) {
	fs.readFile('../client/' + path, "binary", function(error, file) {
		if (error) {
			response.writeHead(500, {
				"Content-Type": "text/plain"
			});
			response.write(error + "\n");
			response.end();
		} else {
			switch (type) {
				case "png":
					response.writeHead(200, {
						"Content-Type": "image/png"
					});
					break;
				case "jpg":
					response.writeHead(200, {
						"Content-Type": "image/jpeg"
					});
					break;
				case "jpeg":
					response.writeHead(200, {
						"Content-Type": "image/jpeg"
					});
					break;
				case "gif":
					response.writeHead(200, {
						"Content-Type": "image/gif"
					});
					break;

			}

			response.write(file, "binary");
			response.end();
		}
	});
}

function loadPng(response, path) {
	fs.readFile('../client/' + path, "binary", function(error, file) {
		if (error) {
			response.writeHead(500, {
				"Content-Type": "text/plain"
			});
			response.write(error + "\n");
			response.end();
		} else {
			response.writeHead(200, {
				"Content-Type": "image/png"
			});
			response.write(file, "binary");
			response.end();
		}
	});
}

function loadJpeg(response, path) {
	fs.readFile('../client/' + path, "binary", function(error, file) {
		if (error) {
			response.writeHead(500, {
				"Content-Type": "text/plain"
			});
			response.write(error + "\n");
			response.end();
		} else {
			response.writeHead(200, {
				"Content-Type": "image/jpeg"
			});
			response.write(file, "binary");
			response.end();
		}
	});
}


exports.startHtml = startHtml;
exports.load = load;
exports.save = save;
exports.update = update;
exports.add = add;
exports.remove = remove;
exports.setSession = setSession;
exports.getSessions = getSessions;
exports.getFoldlerContent = getFoldlerContent;
exports.getDefaultShape = getDefaultShape;
exports.getDefaultImage = getDefaultImage;
exports.changeDefaultSettings = changeDefaultSettings;
exports.getDefaultSettings = getDefaultSettings;
exports.newCustomShape = newCustomShape;
exports.getCustomShape = getCustomShape;
exports.uploadFile = uploadFile;


exports.loadResource = loadResource;