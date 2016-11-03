var Line = Class.create({

    //constructor
    initialize: function(info, layer) {
        this.id = STATE.getId(info.id);
        this.layer = layer;

        this.createjsShape = new createjs.Shape();
        this.toModel(info);

        this.index = 0;
        this.layer.addElement(this); //will automatically set the correct index for this element
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
                "shape": {
                    "color": this.color,
                    "line": {
                        "strokeStyle": this.strokeStyle,
                        "points": this.points
                    }
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

    //todo layer of element changes
    toModel: function(info) {
        this.radius = info.shape.line.radius;

        //COLOR
        if (typeof info.shape.color == "undefined") {
            console.log("The new color will be " + STATE.color);
            this.color = STATE.color;
        } else {
            this.color = info.shape.color;
        }

        this.points = info.shape.line.points;

        this.strokeStyle = 2;
        this.strokeColor = this.color;

        //draw the actual shape
        this.redrawGraphic();

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

    redrawGraphic: function() {
        this.createjsShape.graphics.clear();

        this.createjsShape.graphics
            .setStrokeStyle(this.strokeStyle)
            .beginStroke(this.color);

        var maxX = this.points[0].x;
        var maxY = this.points[0].y;
        var minX = this.points[0].x;
        var minY = this.points[0].y;
        for (var i = 0; i < this.points.length; i++) {
            var x = this.points[i].x;
            var y = this.points[i].y;
            this.createjsShape.graphics.lineTo(x, y);

            if (x > maxX) {
                maxX = x;
            } else if (x < minX) {
                minX = x;
            }

            if (y > maxY) {
                maxY = y;
            } else if (y < minY) {
                minY = y;
            }

        }
        this.createjsShape.graphics.endStroke();

        this.createjsShape.setBounds(0, 0, maxX - minX, maxY - minY);

        this.createjsShape.regX = minX+(maxX-minX)/2;
        this.createjsShape.regY = minY+(maxY-minY)/2;

        console.log("in line the color is " + this.color);
    },

    getIndex: function() {
        return this.layer.elements['ids'].indexOf(this.id);
    },

    getElementProp: function() {
        return "line";
    }

});