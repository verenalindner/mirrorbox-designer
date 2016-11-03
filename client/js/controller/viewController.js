//______________________________________________________________
//FILE ACTIONS


//new document
function newDoc(sessionName) {
	//TODO. save automatically??
	//save();
	STATE.init();
	STATE.fillEmptyStage();
	postRequest(setSessionPath, sessionName, function() {
		save();
	});
}

function saveAs(sessionName) {
	postRequest(setSessionPath, sessionName, function() {
		save();
	});
}

//load specific document
function handleSetSessionAndLoad() {
	console.log("LOAD SESSION NOW!");
	load();
}

function setSessionAndLoad(sessionName) {
	postRequest(setSessionPath, sessionName, handleSetSessionAndLoad);
}

//save
function save() {
	parser = getParser(false);
	var jsondata = parser.stageSave();
	postRequest(savePath, jsondata);
}

//load session
function handleLoad(jsondata) {
	//STATE.init();
	console.log("Layercount after init() " + STATE.modelStage.layers["ids"].length);
	parser = getParser(false);
	parser.stageLoad(jsondata.stage);
}
function load() {
	getRequest(loadPath, handleLoad);
}

function handleGetSessions(jsondata) {
	console.log(jsondata);
	$("#loadDialog form").empty();
	for (var i = 0; i < jsondata.length; i++) {
		var sessionName = jsondata[i].name;
		var html = '<input type="radio" name="file" value="' + sessionName + '" id="' + sessionName + '"> <label for="' + sessionName + '">' + sessionName + '</label><br>';

		$("#loadDialog form").append(html);
	}

	$("#loadDialog").dialog("open");
}

function getSessions() {
	getRequest(getSessionsPath, handleGetSessions);
}


//______________________________________________________________
//ELEMENT SETTINGS

//get default settings
function handleGetDefaultSettings(defaults) {
	STATE.setDefaults(defaults);
	console.log("Defaults are " + defaults);
}

function getDefaultSettings() {
	getRequest(getDefaultSettingsPath, handleGetDefaultSettings);
}


//needed?
function switchElementHtmlLayer(element, newLayerId) {
	var oldLayerId = element.layer.id;

	$("#element_" + element.id).remove();

	appendElemToHtml(element, newLayerId);
	// $("#layer_" + newLayerId + ":nth-child(1)").after(element.toHtml());
}

function duplicatElement() {
	var element = STATE.selectedElement.parent;
	var elementJson = element.toJson().element;
	elementJson.id = -1;
	elementJson.x += 5;
	elementJson.y += 5;
	parser = getParser(false);
	parser.elementLoad(elementJson, element.layer);
}



//______________________________________________________________
//LAYER FUNCTIONALITY

function newLayer() {
	var layer = new Layer();
	postRequest(addPath, {
		"add": [layer.toJson()]
	});

	$("#sortableLayers").append(layer.toHTML());

	$("#layer_" + layer.id + " .delete").click(function(evt) {
		console.log("delete layer");
		removeLayer(layer);
	});

	changeView(STATE.stapleView);
}

function updateLayerIndex(layerId, newIndex) {
	STATE.modelStage.changeLayerIndex(layerId, newIndex);
	var jsondata = STATE.modelStage.layers["'" + layerId + "'"].toJson();

	postRequest(updatePath, {
		"update": [jsondata]
	});
}

function removeLayer(layer) {
	console.log("removeLayer");
	STATE.modelStage.removeLayer(layer);
	$("#layer_" + layer.id).remove();

	postRequest(removePath, {
		"remove": [layer.toJson()]
	});
	changeView(STATE.stapleView);
}

function showLayer(htmlLayer, show) {
	console.log("layer visible toggled");
	var layer = STATE.modelStage.layers["'" + htmlLayer.id.split("_")[1] + "'"];
	if (!show) {
		$(htmlLayer).next().css("background-image", "url('../img/gui/appbar.eye_s.png')");
		var id = htmlLayer.id.split("_")[1];
		layer.createjsLayer.visible = true;
		console.log("Show the layer " + htmlLayer.id);
	} else {
		console.log("hide the layer " + htmlLayer.id);
		$(htmlLayer).next().css("background-image", "url('../img/gui/appbar.eye.hide_s.png')");
		layer.createjsLayer.visible = false;
	}
}


//Specifies whether the borders of the layers should be visible or hidden
function toggleLayerBorders(show) {
	var layers = STATE.modelStage.layers['ids'];

	for (var i = 0; i < layers.length; i++) {
		var layer = STATE.modelStage.layers["'" + layers[i] + "'"];
		if (show) {
			console.log("show the layer " + layers[i].id);
			layer.border.visible = true;
		} else {
			console.log("hide the layer " + layers[i].id);
			layer.border.visible = false;
		}
	}
}


//______________________________________________________________
//FILE UPLOAD
function uploadFile() {
	var formData = new FormData($('#uploadForm')[0]);

	$.ajax({
		url: uploadFilePath, //Server script to process data
		type: 'POST',
		xhr: function() { // Custom XMLHttpRequest
			var myXhr = $.ajaxSettings.xhr();
			if (myXhr.upload) { // Check if upload property exists
				myXhr.upload.addEventListener('progress', handleUploadProgress, false); // For handling the progress of the upload
			}
			return myXhr;
		},
		//Ajax events
		beforeSend: function() {
			$('progress').show();
		},
		success: handleUploadSuccess,
		error: function(x, textStatus) {
			console.log("error");
			console.log(textStatus);
		},
		// Form data
		data: formData,
		//Options to tell jQuery not to process data or worry about content-type.
		cache: false,
		contentType: false,
		processData: false
	});
}

function handleUploadSuccess(data, textStatus, jqXHR) {
	var files = data.split(",");

	jQuery.each(files, function(index, value) {
		var img = "<img src='" + value + "'' id='" + value + "'' alt='customImg'>";
		$("#customImgContainer").prepend(img);
	});

	$(".imgContainer img").draggable({
		opacity: 0.8,
		helper: "clone",
		start: function(event, ui) {
			//Set it to the front
			$(ui.helper[0]).css({
				"z-index": 10,
				"border": "none"
			});
		},
		stop: function(event, ui) {
			console.log("Stopped at position " + event.toElement.id);
		}
	});

	$('progress').hide();

	console.log("SUCCESS");
	console.log(data);
	console.log(textStatus);
	console.log(jqXHR);
}

function handleUploadProgress(evt) {
	if (evt.lengthComputable) {
		$('progress').attr({
			value: evt.loaded,
			max: evt.total
		});
	}
}



//_____________________________________

//create elements
function newRect(info, layer) {
	var rect = new Rect(info, layer);
	addElement(rect);
	appendElemToHtml(rect, layer.id);
}

function newCircle(info, layer) {
	var circle = new Circle(info, layer);
	addElement(circle);
	appendElemToHtml(circle, layer.id);
}

function newText(info, layer) {
	var text = new Texx(info, layer);
	addElement(text);
	appendElemToHtml(text, layer.id);
}

function newPolystar(info, layer) {
	var star = new Polystar(info, layer);
	addElement(star);
	appendElemToHtml(star, layer.id);
}

function newLine(info, layer) {
	var line = new Line(info, layer);
	addElement(line);
	appendElemToHtml(line, layer.id);
}

function newHalfCircle(info, layer) {
	var hCircle = new HalfCircle(info, layer);
	addElement(hCircle);
	appendElemToHtml(hCircle, layer.id);
}

function newImage(info, layer) {
	var img = new Image(info, layer, addImage);
}

function newGroup(info, layer) {
	var group = new Group(layer, info);
	addElement(group);
	appendElemToHtml(group, layer.id);
}

//get image

function getImg(src) {
	postGetRequest(getDefaultImagePath, src, function(jsondata) {
		newImage(jsondata, STATE.selectedLayer);
	});
}

function getDefaultShape(type) {
	switch (type) {
		case "rect":
			postGetRequest(getDefaultShapePath, type, function(jsondata) {
				newRect(jsondata, STATE.selectedLayer);
			});
			break;
		case "circle":
			postGetRequest(getDefaultShapePath, type, function(jsondata) {
				newCircle(jsondata, STATE.selectedLayer);
			});
			break;
		case "polystar":
			postGetRequest(getDefaultShapePath, type, function(jsondata) {
				newPolystar(jsondata, STATE.selectedLayer);
			});
			break;
		case "img":
			console.log("RRROR!!");
			//postGetRequest(getDefaultShapePath, type, handleGetImg);	
			break;
		case "text":
			postGetRequest(getDefaultShapePath, type, function(jsondata) {
				newText(jsondata, STATE.selectedLayer);
			});
			break;
		case "line":
			postGetRequest(getDefaultShapePath, type, function(jsondata) {
				newLine(jsondata, STATE.selectedLayer);
			});
			break;
		case "halfCircle":
			postGetRequest(getDefaultShapePath, type, function(jsondata) {
				newHalfCircle(jsondata, STATE.selectedLayer);
			});
	}
	//postGetRequest(getDefaultShapePath, type, handleGetDefaultShape);
}


//called when an image is dropped into the canves --> create new Shape/Image
function handleImgDropped(elementPosition, layer, draggedId, draggedClass) {
	if (draggedClass.indexOf("customShape") > -1) {
		postGetRequest(getCustomShapePath, draggedId, function(info) {
			info.customShape.x = elementPosition[0];
			info.customShape.y = elementPosition[1];
			info.customShape.id = -1;
			parser = getParser(false);
			parser.elementLoad(info.customShape, layer);
		});
	} else if (draggedId.indexOf("Tool") > -1) {
		switch (draggedId) {
			case "rectTool":
				postGetRequest(getDefaultShapePath, "rect", function(info) {
					info.x = elementPosition[0];
					info.y = elementPosition[1];
					newRect(info, layer);
				});
				break;
			case "circleTool":
				postGetRequest(getDefaultShapePath, "circle", function(info) {
					info.x = elementPosition[0];
					info.y = elementPosition[1];
					newCircle(info, layer);
				});
				break;
			case "polystarTool":
				postGetRequest(getDefaultShapePath, "polystar", function(info) {
					info.x = elementPosition[0];
					info.y = elementPosition[1];
					newPolystar(info, layer);
				});
				break;
			case "textTool":
				postGetRequest(getDefaultShapePath, "text", function(info) {
					info.x = elementPosition[0];
					info.y = elementPosition[1];
					newText(info, layer);
				});
				break;
			case "lineTool":
				postGetRequest(getDefaultShapePath, "line", function(info) {
					info.x = elementPosition[0];
					info.y = elementPosition[1];
					newLine(info, layer);
				});
				console.log("New line");
				break;
			case "halfCircleTool":
				postGetRequest(getDefaultShapePath, "halfCircle", function(info) {
					info.x = elementPosition[0];
					info.y = elementPosition[1];
					newHalfCircle(info, layer);
				});
				console.log("New halfCircle");
				break;
			case "group":

				break;
		}
	} else {
		postGetRequest(getDefaultImagePath, draggedId, function(info) {
			info.x = elementPosition[0];
			info.y = elementPosition[1];
			newImage(info, layer);
		});
	}
}

//______________________________________________________________
//JSON REQUEST BUILDER

function addElement(element) {
	var json = {
		"add": [element.toJson()]
	};
	postRequest(addPath, json);
}

//add image will be called by the image itself upon the completiono floading
function addImage(img) {
	postRequest(addPath, {
		"add": [img.toJson()]
	});
	appendElemToHtml(img, img.layer.id);
}

//ELEMENT TRANSFORMATIONS
function updateElement(element) {
	var json = {
		"update": [element.toJson()]
	};
	postRequest(updatePath, json);
	//todo: do this for more than one object
}

function removeElement(element) {
	// 
	// if (STATE.selectedElement && STATE.selectedElement.parent == element) {
	STATE.removeSelectedElement(element);
	element.layer.removeElement(element);
	$("#element_" + element.id).remove();

	postRequest(removePath, {
		"remove": [element.toJson()]
	});
}


function updateElementIndex(element, action, oldLayerId) {
	var json;
	if (action != -1) {
		json = {
			"update": [{
				"layerId": element.layer.id,
				"elementId": element.id,
				"action": action
			}]
		};
	} else if (oldLayerId != -1) {
		json = {
			"update": [{
				"layerId": oldLayerId,
				"elementId": element.id,
				"newLayerIndex": element.layer.getIndex(),
			}]
		};
	}

	postRequest(updatePath, json);
}

function appendElemToHtml(element, layerId) {
	// $("#layer_" + layerId).append(element.toHtml());

	$("#layer_" + layerId).children(":first").after(element.toHtml());
	$("#hideElement_" + element.id).prop("checked", element.createjsShape.isVisible());

	$("#hideElement_" + element.id).change(function(evt) {
		console.log("hide element");
		// var element = STATE.modelStage.layers["'"+layerId+"'"].elements["'"+element.id+"'"];
		if (!this.checked) {
			element.createjsShape.visible = false;
		} else {
			element.createjsShape.visible = true;
		}
	});

	$("#element_" + element.id + " .delete").click(function(evt) {
		console.log("delete element");
		removeElement(element);
	});

	$("#element_" + element.id).click(function(evt) {
		STATE.setSelectedElement(element);
	});
}

//_____________________________________
function handleNewCustomShape(info) {
	var html = "<div class='customShape' id='" + info.name + "'>" + info.name + "</div>";
	$("#customShapeContainer").append(html);

	$(".customShape").draggable({
		opacity: 0.8,
		helper: "clone",
		start: function(event, ui) {
			//Set it to the front
			$(ui.helper[0]).css({
				"z-index": 10,
				"border": "none"
			});
		},
		stop: function(event, ui) {
			console.log("Stopped at position " + event.toElement.id);
		}
	});
}

function newCustomShape(name, element) {
	var json = {
		"name": name,
		"customShape": element.toJson().element
	};

	new postGetRequest(newCustomShapePath, JSON.stringify(json), handleNewCustomShape);
}


function handleGetCustomShape(info) {
	//TODO if!!
	new Polystar(info.customShape, STATE.selectedLayer);
}

function getCustomShape(name) {
	new postGetRequest(getCustomShapePath, name, handleGetCustomShape);
}

//______________________________________________________________
//CANVAS VIEW OPTIONS

//should be called update view
function changeView(isStaple) {
	var layers = STATE.modelStage.layers;

	if (isStaple) {
		if (STATE.selectedElement)
			STATE.selectedElement.offset = 0;
		//set on on top of another in z-direction
		for (var j = 0; j < layers.ids.length; j++) {
			layers["'" + layers.ids[j] + "'"].setY(0);
		}
		document.getElementById("canvas").height = STATE.layerHeight;
		STATE.stapleView = true;
	} else {
		console.log("layers.ids " + layers.ids);
		console.log("layers['ids'] " + layers['ids']);
		for (var i = 0; i < layers.ids.length; i++) {
			var layer = layers["'" + layers.ids[i] + "'"];
			var stageIndex = STATE.stage.getNumChildren() - 1 - STATE.stage.getChildIndex(layer.createjsLayer);

			if (STATE.selectedElement) {
				STATE.selectedElement.offset = STATE.layerHeight * stageIndex;
				stageIndex -= 1;
			}

			layer.setY(STATE.layerHeight * stageIndex);

			console.log("Set the layer y to " + STATE.layerHeight * stageIndex);
		}
		document.getElementById("canvas").height = layers.ids.length * STATE.layerHeight;
		STATE.stapleView = false;
	}
}

function updateCanvasSize() {
	factor = 1;
	if (!STATE.stapleView) {
		factor = STATE.modelStage.layers.ids.length;
	}

	document.getElementById("canvas").height = factor * STATE.layerHeight * STATE.stage.scaleY;
	document.getElementById("canvas").width = STATE.layerWidth * STATE.stage.scaleX;
}


//______________________________________________________________
// DESIGN AIDS

function addReferenceLine() {
	hRefLineCount++;

	console.log("add new refLine");

	var containerClass = "lineContainer_" + hRefLineCount;
	var height = (STATE.modelStage.layers["ids"].length - 1) * STATE.layerHeight;
	$("#canvasContainer").append("<div style='width:100%; height:" + height + "px;' class='lineContainer " + containerClass + "'> </div>");

	var offset = $("#canvas").offset();

	for (var i = 0; i < STATE.modelStage.layers["ids"].length; i++) {

		var id = "hRefLine_" + hRefLineCount + "_" + i;
		var line = "<div class='line hRefLine_" + hRefLineCount + "' id='" + id + "'> </div>";
		$("." + containerClass).append(line);

		$("#" + id).offset({
			top: offset.top + (i * STATE.layerHeight),
			//left: offset.left
		});

		if (STATE.stapleView) {
			if (i > 1) {
				$("#" + id).hide();
			}
		}
	}

	$("." + containerClass).draggable({
		axis: "y",
		handle: ".line",
		cursor: "ns-resize",
		containment: [offset.left, offset.top, 1000, (offset.top + STATE.layerHeight)]
	});
}

function addVReferenceLine() {
	var containerClass = "lineContainer_" + hRefLineCount;
	var height = (STATE.modelStage.layers["ids"].length - 1) * STATE.layerHeight;
	$("#canvasContainer").append("<div class='vline'> </div>");
	$(".vline").draggable({
		axis: "x",
		containment: "parent"
	});

}

function checkForOverlap(element) {
//TODO
}


//______________________________________________________________
//GROUP ELEMENTS

var groups = 1;
function groupElements() {
	var select;
	STATE.stage.addEventListener("stagemousedown", function(evt) {
		console.log("HIT AT " + evt.stageX + ", " + evt.stageY);

		select = new createjs.Shape();
		select.graphics
			.beginFill("4433ff")
			.drawRect(0, 0, 1, 1);

		select.x = evt.stageX;
		select.y = evt.stageY;
		select.alpha = 0.3;

		STATE.stage.addChild(select);

		select.scaleX = 4;

		groups = 0;
		//select.x = select.x-4*10;

	});

	STATE.stage.addEventListener("stagemouseup", function(evt) {
		console.log("Mouseup AT " + evt.stageX + ", " + evt.stageY);
		if (select) {
			select.scaleX = evt.stageX - select.x;
			select.scaleY = evt.stageY - select.y;
		}
	});

	STATE.stage.on("pressmove", function(evt) {
		// console.log("pressmove");
		//console.log("Mouseup AT " + evt.stageX + ", " + evt.stageY);
		select.scaleX = evt.stageX - select.x;
		select.scaleY = evt.stageY - select.y;

	});

	STATE.stage.on("pressup", function(evt) {
		console.log("pressup");
		//  STATE.stage.removeChild(select);
		var areaXMin = select.x;
		var areaXMax = evt.stageX;
		if (areaXMin > areaXMax) {
			areaXMin = evt.stageX;
			areaXMax = select.x;
		}

		var areaYMin = select.y;
		var areaYMax = evt.stageY;
		if (areaYMin > areaYMax) {
			areaYMin = evt.stageY;
			areaYMax = select.y;
		}

		var affectedElems = [];

		console.log("areaXMax is " + areaXMax + " and areaXMin: " + areaXMin);

		// if (STATE.selectedLayer) {
		var layer;

		if (STATE.stapleView) {
			layer = STATE.selectedLayer;
		} else {
			layerIndex = Math.floor(select.y / STATE.layerHeight);
			layerId = STATE.modelStage.layers["ids"][layerIndex];
			layer = STATE.modelStage.layers["'" + layerId + "'"];

			areaYMin -= layerIndex * STATE.layerHeight;
			areaYMax -= layerIndex * STATE.layerHeight;
		}

		for (var i = 0; i < layer.elements["ids"].length; i++) {
			var id = layer.elements["ids"][i];
			var element = layer.elements["'" + id + "'"];
			var shape = element.createjsShape;

			if (shape.x >= areaXMin && shape.x <= areaXMax) {
				if (shape.y >= areaYMin && shape.y <= areaYMax) {

					console.log("Shape " + element.getElementProp() + " inside!");

					affectedElems.push(element);
				}

			}
		}

		STATE.stage.removeChild(select);
		STATE.stage.removeAllEventListeners();
		$("#groupElements").toggleClass("checked", false);

		var jsonElems = [];

		//TODO make this nicer!!
		if (affectedElems.length > 1) {
			for (var j = 0; j < affectedElems.length; j++) {
				var json = affectedElems[j].toJson();
				jsonElems.push(json.element);
				removeElement(affectedElems[j]);
			}
			var info = {
				"group": {
					"elements": jsonElems
				}
			};

			//the vent is sometimes triggered several times....we only want ONE group
			if (groups === 0) {
				newGroup(info, layer);
			}
			groups = 1;
		}
		// }
	});
}

function ungroupElements() {
	console.log("ungroup");
	if (STATE.selectedElement) {
		if (STATE.selectedElement.parent.getElementProp() == "group") {
			var group = STATE.selectedElement.parent;

			/*for (var i = 0; i < group.elements["ids"].length; i++) {
				var elemId = group.elements["ids"][i];
				var element = group.elements["'" + elemId + "'"];
				appendElemToHtml(element, group.layer.id);
			}*/

			STATE.removeSelectedElement();

			group.ungroup();
			removeElement(group);
		}
	} else {

	}

}

//______________________________________________________________
//EDIT

//TODO!! Get default color
function handleGetDefaultColor(defaultColor) {
	return defaultColor;
}

function getDefaultColor() {
	getRequest(getDefaultColorPath, handleGetDefaultColor);
}

//change default settings (color)
function changeDefaultColor(color) {
	var jsondata = {
		"color": "#" + color
	};
	postRequest(changeDefaultSettingsPath, jsondata);
}

//duplicate from editSettings!
function changeColorSettings(newValue) {
	if (STATE.selectedElement) {
		var element = STATE.selectedElement.parent;
		if (element.getElementProp() == "text") {
			element.createjsShape.color = newValue;
		} else {
			element.color = newValue;
			element.redrawGraphic();
		}
	}
}

function updatePositionFields(x, y) {
	$("#xSettings").spinner("value", x);
	$("#ySettings").spinner("value", y);
}

function updateScaleFields(x, y) {
	$("#scaleXAmount").spinner("value", x);
	$("#scaleYAmount").spinner("value", y);
}