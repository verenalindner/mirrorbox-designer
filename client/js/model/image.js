var Image = Class.create({

    //callback is optional and is a function that is to be called after the image has been loaded successfully
    initialize: function(info, layer, callback, htmlCallback) {
        var preload = new createjs.LoadQueue(false);
        preload.on("fileload", handleFileLoad, this);
        preload.loadManifest([{
            src: info.image.src,
            id: info.image.src
        }]);
        //preload.loadManifest([{src:"../img/ui-elems/25.png", id: "../img/ui-elems/25.png"}]);

        function handleFileLoad(event) {
            this.id = STATE.getId(info.id);

            console.log(event.result);

            this.layer = layer;
            this.src = info.image.src;

            this.createjsShape = new createjs.Bitmap(event.result);
            this.toModel(info);

            //this.index;
            layer.addElement(this); //will automatically set the correct index for this element

            if (callback) {
                callback(this);
            }
        }
    },

    toJson: function() {
        var json = {
            "layerId": this.layer.id,
            "elementId": this.id,
            "element": {
                "id": this.id,
                "x": this.createjsShape.x,
                "y": this.createjsShape.y,
                "elemIndex": this.index,
                "image": {
                    "src": this.src,
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

    toModel: function(info) {

        console.log("IMAGE w,h: " + this.createjsShape.image.width, this.createjsShape.image.height)
        this.createjsShape.setBounds(info.x, info.y, this.createjsShape.image.width, this.createjsShape.image.height);
        this.createjsShape.regX = this.createjsShape.image.width / 2;
        this.createjsShape.regY = this.createjsShape.image.height / 2;

        this.createjsShape.x = info.x;
        this.createjsShape.y = info.y;

        if (info.transformations) {
            if (info.transformations.rotation) {
                this.createjsShape.rotation = info.transformations.rotation;
            }
            if (info.transformations.alpha) {
                this.createjsShape.alpha = info.transformations.alpha;
            }
            if (info.transformations.scaleX) {
                this.createjsShape.scaleX = info.transformations.scaleX;
            }
            if (info.transformations.scaleY) {
                this.createjsShape.scaleY = info.transformations.scaleY;
            }
        }
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

    getIndex: function() {
        return this.layer.elements['ids'].indexOf(this.id);
    },

    getElementProp: function() {
        return "img";
    }

});