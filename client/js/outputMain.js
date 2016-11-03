var STATE;
var preload, manifest, parser, socket;

function init() {
	//initialize state
	var modelStage = new Stage(document.getElementById("canvas"));
	STATE = new State(modelStage);
	STATE.stage = modelStage.createjsStage;

	parser = new Parser(true);
	socket = io.connect("http://localhost");

	//add array funtionality
	Array.prototype.move = function(old_index, new_index) {
		if (new_index >= this.length) {
			var k = new_index - this.length;
			while ((k--) + 1) {
				this.push("undefined");
			}
		}
		var changedValue = this.splice(old_index, 1)[0];
		this.splice(new_index, 0, changedValue);
		if (typeof this[0] == "undefined")
			this.splice(0, 1);
	};

	handleComplete("event");

	initSocket();
}

function initSocket() {
	socket.on("connected", function(data) {
		console.log("Status: " + data);
		STATE.stage.scaleX = 0.55;
		//STATE.stage.x = STATE.layerWidth;
		
		document.getElementById("canvas").width = STATE.layerWidth;
		document.getElementById("canvas").height = STATE.layerHeight * STATE.layerCount;

		STATE.stage.scaleY = -0.55;
		STATE.stage.y = STATE.layerHeight * STATE.layerCount; // * STATE.modelStage.layers.length;
		
		/*
				console.log("Status: " + data);
		STATE.stage.scaleX = 0.99;
		//STATE.stage.x = STATE.layerWidth;
		
		document.getElementById("canvas").width = STATE.layerWidth;
		document.getElementById("canvas").height = STATE.layerHeight * STATE.layerCount;

		STATE.stage.scaleY = -0.99;
		STATE.stage.y = STATE.layerHeight * STATE.layerCount; // * STATE.modelStage.layers.length; 
*/
	});

	socket.on("load", function(data) {
		console.log("There has been an update!");

		STATE.reset();

		//result as an JavaScript object
		var jsondata = eval("(" + data + ")");

		console.log(jsondata);

		parser.stageLoad(jsondata.stage);
		console.log("There are layers: " + STATE.modelStage.layers);
	});

	//should be more dynamic (server should send relevant data)
	socket.on("new", function(data) {
		STATE.reset();
		STATE.fillEmptyStage();
	});

	socket.on("update", function(data) {
		//console.log(data);
		console.log("There has been an update!");

		var updateJson = eval('(' + data + ')');
		parser.update(updateJson);
	});

	socket.on("index", function(data) {
		//console.log(data);
		console.log("There has been an indexChange!");

		var updateJson = eval('(' + data + ')');
		parser.index(updateJson);
	});

	socket.on("add", function(data) {
		var json = eval('(' + data + ')');
		console.log("new Element!!");
		parser.add(json);
	});

	socket.on("remove", function(data) {
		console.log("delete Element");
		var json = eval('(' + data + ')');
		parser.remove(json);
	});
}

function handleComplete(event) {
	changeView();
	createjs.Ticker.addEventListener("tick", tick);
	console.log("It ticks");

}

function changeView() {
	var layers = STATE.modelStage.layers;
	STATE.stage.y = STATE.layerHeight * layers.ids.length;

	console.log("Stage y is " + STATE.stage.y);

	for (var i = 0; i < layers.ids.length; i++) {
		var layer = layers["'" + layers.ids[i] + "'"];
		var stageIndex = STATE.stage.getNumChildren() - 1 - STATE.stage.getChildIndex(layer.createjsLayer);

		if (STATE.selectedElement) {
			STATE.selectedElement.offset = STATE.layerHeight * stageIndex;
			stageIndex -= 5;
		}

		layer.setY(STATE.layerHeight * stageIndex);

		console.log("Set the layer y to " + STATE.layerHeight * stageIndex);
	}
	document.getElementById("canvas").height = layers.ids.length * STATE.layerHeight;
}

function tick(event) {
	STATE.stage.update(event);
}

function getParser(editable) {
    if (!parser) {
        return new Parser(editable);
    } else {
        return parser;
    }
}