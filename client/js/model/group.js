var Group = Class.create({

    //constructor
    initialize: function(layer, info) {
        if (info) {
            this.id = STATE.getId(info.id);
        } else {
            this.id = STATE.getId(-1);
        }
		
		    this.layer = layer;
		
		this.id = STATE.getId(info.id);
        this.layer = layer;
		this.createjsShape = new createjs.Container();
		
		this.toModel(info);
 
        this.layer.addElement(this); //will automatically set the correct index for this element

        var that = this;
    },

    // adds an element to the group
    addElement: function(element) {
        STATE.saved = false;

        this.elements["'" + element.id + "'"] = element;
        this.elements['ids'].push(element.id);

        var updateOtherPos = false;
        var x = element.createjsShape.x;
        var y = element.createjsShape.y;

        element.createjsShape.x -= this.offsetX;
        element.createjsShape.y -= this.offsetY;


        var globalPos = element.createjsShape.localToGlobal(x, y);

      /*  console.log("element pos: " + x + ", " + y + " globalToLocal " + element.createjsShape.globalToLocal(globalPos.x, globalPos.y));
        console.log("element pos: " + x + ", " + y + " localToLocal +" + element.createjsShape.localToLocal(x, y, this.createjsShape));
        console.log("element pos: " + x + ", " + y + " localToGlobal " + element.createjsShape.localToGlobal(x, y));
*/
        //element will be added at the beginning (to the background)
        this.createjsShape.addChild(element.createjsShape);
    },

    setY: function(newY) {
        this.createjsShape.y = newY;
        this.layerMask.y = newY;
    },

    toJson: function() {
        var elementJson = [];

        for (var i = 0; i < this.elements["ids"].length; i++) {
            var elemId = this.elements["ids"][i];
            elementJson.push(this.elements["'" + elemId + "'"].toJson().element);
        }

        var json = {
            "layerId": this.layer.id,
            "elementId": this.id,
            "element": {
                "id": this.id,
                "x": this.createjsShape.x,
                "y": this.createjsShape.y,
                "group": {
                    "offsetX": this.offsetX,
                    "offsetY": this.offsetY,
                    "elements": elementJson

                },
                "transformations": {
                    "alpha": this.createjsShape.alpha,
                    "scaleX": this.createjsShape.scaleX,
                    "scaleY": this.createjsShape.scaleY,
                    "rotation": this.createjsShape.rotation,
                }
            }
        };

        return json;
    },

    toHtml: function() {
        var html = "<div class='element' id='element_" + this.id + "'>" +
            "   <div class='showElement'>" +
            "       <input type='checkbox' title='Show Element' id='hideElement_" + this.id + "' class='elementToggle'>" +
            "       <label for='hideElement_" + this.id + "'> </label>" +
            "   </div>" +
            "   <div class='elementName' title='delete Element'> <h4 title='delete Element'>" + this.getElementProp() + " " + this.id + "</h4> </div>" +
            "<div class='delete'> x </div>" +
            "</div>";

        return html;
    },
	
	toModel: function(info){
		var groupElements = info.group.elements;
        var newElements = [];

        //new elements object, where elements can be accessed via their id or it can be iterated over the array of ids
        this.elements = {};
        this.elements['ids'] = [];

        this.selectedElement = null;
        this.createjsShape.mouseChildren = false;

        //first the correct offset needs to be computed
        if (info.group.offsetX) {
            this.offsetX = info.group.offsetX;
            this.offsetY = info.group.offsetY;

            for (var j = 0; j < groupElements.length; j++) {

                //first the Elements need to be created!
                var groupElem = groupElements[j];
                var parser = getParser(false);
                parser.isOutput = true;
                var element = parser.elementLoad(groupElem, this.layer);
				
				
                if (element.createjsShape.x < this.offsetX) {
                    this.offsetX = element.createjsShape.x;
                }
                if (element.createjsShape.y < this.offsetY) {
                    this.offsetY = element.createjsShape.y;
                }
				
                newElements.push(element);
            }

        } else {
            this.offsetX = 999999;
            this.offsetY = 999999;
            for (var i = 0; i < groupElements.length; i++) {

                //first the Elements need to be created!
                var groupElem = groupElements[i];
                var parser = getParser(false);
                parser.isOutput = true;
                var element = parser.elementLoad(groupElem, this.layer);

                if (element.createjsShape.x < this.offsetX) {
                    this.offsetX = element.createjsShape.x;
                }
                if (element.createjsShape.y < this.offsetY) {
                    this.offsetY = element.createjsShape.y;
                }

                newElements.push(element);
            }
        }
		
		if (STATE.editable) {
			parser.isOutput = false;
		}

        if (info.x) {
            //set the correct position of the container
            this.createjsShape.x = info.x; // + this.offsetX;
            this.createjsShape.y = info.y; // + this.offsetY; 
        } else {
            this.createjsShape.x = this.offsetX;
            this.createjsShape.y = this.offsetY;
        }


        // //second: add the actuall element to the group
        for (var j = 0; j < newElements.length; j++) {
            this.layer.removeElement(newElements[j]);
            this.addElement(newElements[j]);
        }
	},

    ungroup: function() {
        for (var i = 0; i < this.elements["ids"].length; i++) {
            var elementId = this.elements["ids"][i];
            var element = this.elements["'" + elementId + "'"];
            this.createjsShape.removeChild(element.createjsShape);
            element.layer = this.layer;
			element.createjsShape.x += this.createjsShape.x;
            element.createjsShape.y += this.createjsShape.y;
			
			var parser = getParser(false);
			var element = parser.elementLoad(element.toJson().element, this.layer);
			/*
			parser
            
            this.layer.addElement(element);*/
        }
    },

    getIndex: function() {
        return STATE.modelStage.layers.ids.indexOf(this.id);
    },

    getElementProp: function() {
        return "group";
    }

});