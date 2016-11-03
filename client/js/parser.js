//Parses JsonData into the MirrorModel
//...Load() creates new instances: load
//...Update() updates existing instances
//...Save() creates json data
var Parser = Class.create({
	//constructor
	initialize: function(isOutput) {
		this.isOutput = isOutput;
		//this.stageLoad(scene);
	},

	// LOAD ---------------------------------------------------------------------------------------
	stageLoad: function(jsonStage) {
		if (!this.isOutput) {
			STATE.init();
			$("#sortableLayers").empty();
		}


		for (var i = 0; i < jsonStage.layers.length; i++) {
			this.layerLoad(jsonStage.layers[i]);
		}

		changeView(STATE.stapleView);

	},

	layerLoad: function(jsonLayer) {
		var layer = new Layer(jsonLayer.id);
		if (!this.isOutput) {
			$("#sortableLayers").append(layer.toHTML());

			$("#layer_" + layer.id + " .delete").click(function(evt) {
				console.log("delete layer");
				removeLayer(layer);
			});
		}

		if (jsonLayer.elements) {
			for (var i = jsonLayer.elements.length - 1; i >= 0; i--) {
				this.elementLoad(jsonLayer.elements[i], layer);
			}
		}
	},

	elementLoad: function(jsonElem, layer) {
		if (jsonElem.shape) {
			return this.shapeLoad(jsonElem, layer);
		} else if (jsonElem.image) {
			return this.imageLoad(jsonElem, layer);
		} else if (jsonElem.text) {
			return this.textLoad(jsonElem, layer);
		} else if (jsonElem.group) {
			return this.groupLoad(jsonElem, layer);
		}
	},

	shapeLoad: function(jsonElem, layer) {
		if (this.isOutput) {
			if (jsonElem.shape.circle) {
				return new Circle(jsonElem, layer);
			} else if (jsonElem.shape.rect) {
				console.log(jsonElem);
				return new Rect(jsonElem, layer);
			} else if (jsonElem.shape.polystar) {
				return new Polystar(jsonElem, layer);
			} else if (jsonElem.shape.line) {
				return new Line(jsonElem, layer);
			} else if (jsonElem.shape.halfCircle) {
				return new HalfCircle(jsonElem, layer);
			}
		} else {
			if (jsonElem.shape.circle) {
				return this.newCircle(jsonElem, layer);
			} else if (jsonElem.shape.rect) {
				console.log(jsonElem);
				return this.newRect(jsonElem, layer);
			} else if (jsonElem.shape.polystar) {
				return this.newPolystar(jsonElem, layer);
			} else if (jsonElem.shape.line) {
				return this.newLine(jsonElem, layer);
			} else if (jsonElem.shape.halfCircle) {
				return this.newHalfCircle(jsonElem, layer);
			}
		}
	},

	imageLoad: function(jsonElem, layer) {
		if (this.isOutput) {
			setTimeout(function(){return new Image(jsonElem, layer);},1000);
			
		} else {
			return this.newImage(jsonElem, layer);
		}

	},

	textLoad: function(jsonElem, layer) {
		if (this.isOutput) {
			return new Texx(jsonElem, layer);
		} else {
			return this.newText(jsonElem, layer);
		}
	},

	groupLoad: function(jsonElem, layer) {
		if (this.isOutput) {
			return new Group(layer, jsonElem);
		} else {
			return this.newGroup(jsonElem, layer); //TODO change order
		}
	},

	//_________________________________________________
	//create elements
	newRect: function(info, layer) {
		var rect = new Rect(info, layer);
		addElement(rect);
		appendElemToHtml(rect, layer.id);
		return rect;
	},

	newCircle: function(info, layer) {
		var circle = new Circle(info, layer);
		addElement(circle);
		appendElemToHtml(circle, layer.id);
		return circle;
	},

	newText: function(info, layer) {
		var text = new Texx(info, layer);
		addElement(text);
		appendElemToHtml(text, layer.id);
		return text;
	},

	newPolystar: function(info, layer) {
		var star = new Polystar(info, layer);
		addElement(star);
		appendElemToHtml(star, layer.id);
		return star;
	},

	newLine: function(info, layer) {
		var line = new Line(info, layer);
		addElement(line);
		appendElemToHtml(line, layer.id);
		return line;
	},

	newHalfCircle: function(info, layer) {
		var hCircle = new HalfCircle(info, layer);
		addElement(hCircle);
		appendElemToHtml(hCircle, layer.id);
		return hCircle;
	},

	newImage: function(info, layer) {
		var img = new Image(info, layer, addImage);
		setTimeout(function(){return img;},500);
		
	},

	newGroup: function(info, layer) {
		var group = new Group(layer, info);
		layer.addElement(group);
		appendElemToHtml(group, layer.id);
		return group;
	},

	// UPDATE ---------------------------------------------------------------------------------------

	updateElem: function(json) {
		console.log("JSON IS:");
		console.log(json);

		for (var i = 0; i < json.update.length; i++) {
			var updateLayer = STATE.modelStage.layers["'" + json.update[i].layerId + "'"];

			var updateElem = updateLayer.elements["'" + json.update[i].elementId + "'"];

			updateElem.toModel(json.update[i].element);
		}
	},

	updateLayer: function(json) {
		//var updateLayer = STATE.modelStage.layers["'"+json.update[i].layerId+"'"];
		STATE.modelStage.changeLayerIndex(json.layerId, json.newIndex);
	},

	update: function(json) {
		for (var i = 0; i < json.update.length; i++) {
			var updateLayer = STATE.modelStage.layers["'" + json.update[i].layerId + "'"];

			var layerIndex = json.update[i].layerIndex;
			if (typeof layerIndex != 'undefined') {
				console.log("Layer Index updated");
				STATE.modelStage.changeLayerIndex(updateLayer.id, layerIndex);
			}

			var updateElem = updateLayer.elements["'" + json.update[i].elementId + "'"];
			if (typeof updateElem != 'undefined') {
				console.log("Element updated");
				if (json.update[i].element) {
					updateElem.toModel(json.update[i].element);
				}

				var action = json.update[i].action;
				if (typeof action != 'undefined') {
					console.log("Layer Index updated");
					if (action == "oneForward") {
						updateElem.layer.changeElementIndex(updateElem.id, updateElem.getIndex() + 1);
					} else if (action == "oneBackward") {
						updateElem.layer.changeElementIndex(updateElem.id, updateElem.getIndex() - 1);
					} else if (action == "toFront") {
						updateElem.layer.changeElementIndex(updateElem.id, updateElem.layer.elements['ids'].length - 1);
					} else if (action == "toBack") {
						updateElem.layer.changeElementIndex(updateElem.id, 0);
					}
				}

				var newLayerIndex = json.update[i].newLayerIndex;
				if (typeof newLayerIndex != 'undefined') {
					updateLayer.switchElementLayer(updateElem, newLayerIndex);
				}

			}
		}
	},

	//index
	index: function(json) {
		for (var i = 0; i < json.index.length; i++) {
			var updateLayer = STATE.modelStage.layers["'" + json.index[i].layerId + "'"];
			var element = updateLayer.elements["'" + json.index[i].elementId + "'"];

			var action = json.index[i].action;
			if (typeof action != 'undefined') {
				console.log("Layer Index updated");
				if (action == "oneForward") {
					element.layer.changeElementIndex(element.id, element.getIndex() - 1);
				} else if (action == "oneBackward") {
					element.layer.changeElementIndex(element.id, element.getIndex() + 1);
				} else if (action == "toFront") {
					element.layer.changeElementIndex(element.id, 0);
				} else if (action == "toBack") {
					element.layer.changeElementIndex(element.id, element.layer.elements['ids'].length - 1);
				}
			}

			var newLayerIndex = json.index[i].newLayerIndex;
			if (typeof newLayerIndex != 'undefined') {
				updateLayer.switchElementLayer(element, newLayerIndex);
			}
		}
	},

	//ADD
	add: function(json) {
		for (var i = 0; i < json.add.length; i++) {
			var data = json.add[i];
			if (data.element || data.group) {
				this.elementLoad(data.element, STATE.modelStage.layers["'" + data.layerId + "'"]);
				//this.addElement(data);
			} else {
				this.addLayer(data);
			}
		}
	},

	addLayer: function(data) {
		//new Layer(data.id);
		this.layerLoad(data);
		changeView();
	},

	//REMOVE
	remove: function(json) {
		for (var i = 0; i < json.remove.length; i++) {
			var data = json.remove[i];

			var layer = STATE.modelStage.layers["'" + data.layerId + "'"];
			if (data.elementId) {
				layer.removeElement(layer.elements["'" + data.elementId + "'"]);
			} else {
				STATE.modelStage.removeLayer(layer);
				changeView(false);
			}
		}
	},

	// SAVE ---------------------------------------------------------------------------------------
	stageSave: function() {
		var layers = [];

		for (var i = 0; i < STATE.modelStage.layers.ids.length; i++) {
			var id = STATE.modelStage.layers.ids[i];
			var modelLayer = STATE.modelStage.layers["'" + id + "'"];

			console.log("SAVE: saving now element with id " + id);
			console.log(STATE.modelStage.layers);
			console.log(modelLayer);

			layers.push(this.layerSave(modelLayer));

			//layers.push(this.layerSave(STATE.modelStage.layers[]));
		}

		var json = {
			"stage": {
				"layers": layers
			}
		};
		return json;
	},

	layerSave: function(modelLayer) {
		var elements = [];

		for (var i = 0; i < modelLayer.elements.ids.length; i++) {
			var id = modelLayer.elements.ids[i];
			var modelElement = modelLayer.elements["'" + id + "'"];
			elements.push(this.elementSave(modelElement));
		}

		var json = {
			"id": modelLayer.id,
			"elements": elements,
		};
		return json;
	},

	elementSave: function(modelElement) {
		return modelElement.toJson().element;
	}
});