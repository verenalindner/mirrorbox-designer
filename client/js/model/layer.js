var Layer = Class.create({

    //constructor
    initialize: function(id) {
        this.id = STATE.getId(id);

        this.index = 0;

        //new elements object, where elements can be accessed via their id or it can be iterated over the array of ids
        this.elements = {};
        this.elements['ids'] = [];

        this.selectedElement = null;

        this.createjsLayer = new createjs.Container();
        STATE.modelStage.addLayer(this); //will automatically set the correct index for this layer
        if (!STATE.stapleView) {
            this.createjsLayer.y = this.index * STATE.layerHeight;
        } else {
            this.createjsLayer.y = 0;
        }

        this.border = new createjs.Shape();
        this.border.graphics.setStrokeStyle(4, "round").beginStroke("#000").drawRect(0, 0, STATE.layerWidth, STATE.layerHeight);
        this.border.y = 0;
        this.createjsLayer.addChild(this.border);

        this.layerMask = new createjs.Shape();
        this.layerMask.graphics.beginFill("#000").drawRect(0, 0, STATE.layerWidth, STATE.layerHeight);
        this.layerMask.y = this.createjsLayer.y;
        this.createjsLayer.mask = this.layerMask;



        console.log("CREATED LAYER " + this.id + " at index " + this.index + " with y=" + this.createjsLayer.y + " (STATE.layerHeight: " + STATE.layerHeight + "), and border " + this.border.y);


        var that = this;
    },

    // adds an element to layer and automatically sets the index of it
    addElement: function(element) {
        STATE.saved = false;

        this.elements["'" + element.id + "'"] = element;
        // this.elements['ids'].push(element.id);
        this.elements['ids'].splice(this.elements['ids'].length, 1, element.id);

        console.log("will now add " + element.id + " to layer " + this.id);

        //element will be added to the end(to the front)
        this.createjsLayer.addChild(element.createjsShape);
        element.index = this.createjsLayer.getNumChildren() - 1;

        //add eventListener to the element
        element.createjsShape.on("mousedown", function(evt) {
            console.log("mousedown on " + element.getElementProp());
            STATE.setSelectedElement(element);

        });

        console.log("Stage number of layers " + STATE.modelStage.layers.ids.toString());
    },

    //removes an element from a layer
    removeElement: function(element) {
        console.log("ids before " + this.elements["ids"]);

        for (var i = 0; i < this.elements["ids"].length; i++) {
            if (element.id == this.elements["ids"][i]) {
                this.elements["ids"].splice(i, 1);

                if (STATE.editable) {
                    STATE.removeSelectedElement();
                }

                break;
            }
        }
        delete this.elements["'" + element.id + "'"];
        this.createjsLayer.removeChild(element.createjsShape);

        console.log("ids after " + this.elements["ids"]);
    },

    //removes an element from a layer
    removeAllElements: function() {
        // for (var i = 0; i < this.elements["ids"].length; i++) {
        //     var elementId = this.elements["ids"][i]);
        //     var element = this.elements["'"+elementId+"'"];
        //        this.removeElement(element);
        // }
        this.elements = {};
        this.elements["ids"] = [];
        this.createjsLayer.removeAllChildren();
    },
    //switches the layer an element  belongs to
    switchElementLayer: function(element, newLayerIndex) {
        if (newLayerIndex < 0 || newLayerIndex > STATE.modelStage.layers["ids"].length) {
            this.removeElement(element);
            return;
        }
        element.layer.removeElement(element);

        if (!STATE.stapleView) {
            var newY = STATE.layerHeight - Math.abs(element.createjsShape.y);
            element.createjsShape.y = Math.abs(newY);
        }

        var newLayerId = STATE.modelStage.layers["ids"][newLayerIndex];
        var newLayer = STATE.modelStage.layers["'" + newLayerId + "'"];
        newLayer.addElement(element);
        element.layer = newLayer;
        console.log("layer at index " + newLayerIndex + " num children " + newLayer.createjsLayer.getNumChildren());
    },

    setY: function(newY) {
        this.createjsLayer.y = newY;
        this.layerMask.y = newY;
    },

    toHTML: function() {
        var htmlLayer = "<div class='layer' id='layer_" + this.id + "'> <div class='select'> <h3>Layer" + this.id + "</h3></div></div>";

        var html = "<div class='layerBox' id='layer_" + this.id + "'>" +
            "   <div class='layer'>" +
            "       <input type='checkbox' id='hideLayer_" + this.id + "' class='layerToggle visibleToggle'>" +
            "       <label for='hideLayer_" + this.id + "'> </label>" +
            "       <div class='select'> <h3>Layer" + this.id + "</h3> </div>" +
            "   <div class='delete' style='padding:0'> x </div>" +
            "   </div>" +
            "</div>";


        return html;
    },

    changeElementIndex: function(elementId, newIndex) {
        var element = this.elements["'" + elementId + "'"];
        var otherElemCount = 1; //for the layerborder
        var oldIndex = element.getIndex();

        console.log("Elements before "+this.elements["ids"]);
        console.log("move element "+elementId+" from "+oldIndex+" to "+newIndex);

        
        this.elements["ids"].move(oldIndex, newIndex);
        this.createjsLayer.setChildIndex(element.createjsShape, newIndex + 1);

        console.log("Elements after "+this.elements["ids"]);

        // var layerChildrenCount = this.createjsLayer.getNumChildren();



        // var layerIndex = layerChildrenCount - newIndex - 1;
        // var oldIndex = layerChildrenCount - 2 - this.createjsLayer.getChildIndex(element.createjsShape);

        // console.log("setting layer" + elementId + " from " + oldIndex + " to new index: " + newIndex);
        // console.log("BEFORE move stage layers :" + STATE.modelStage.layers.ids.toString());

        // console.log("AFTER move stage layers :" + STATE.modelStage.layers.ids.toString());


        //createjs children are displayed in opposite index direction
       
    },

    toJson: function() {
        console.log("Layers in Model are: " + STATE.modelStage.layers.ids);
        console.log("this.id is " + this.id);
        var index = this.getIndex();

        var json = {
            "layerId": this.id,
            "layerIndex": index
        };

        return json;
    },

    getIndex: function() {
        return STATE.modelStage.layers.ids.indexOf(this.id);
    }


});