var Polystar = Class.create({

    //constructor
    initialize: function(info, layer) {
        this.id = STATE.getId(info.id);
        this.layer = layer;

        this.createjsShape = new createjs.Shape();
        this.toModel(info);

        //this.index;
        layer.addElement(this); //will automatically set the correct index for this element

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
                    "fill": this.fill,
                    "stroke": {
                        "isStroke": this.stroke,
                        "strokeColor": this.strokeColor,
                        "strokeStyle": this.strokeStyle
                    },
                    "polystar": {
                        "radius": this.radius,
                        "sides": this.sides,
                        "pointSize": this.pointSize,
                        "angle": this.angle
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
        this.radius = info.shape.polystar.radius;
        this.sides = info.shape.polystar.sides;
        this.pointSize = info.shape.polystar.pointSize;
        this.angle = info.shape.polystar.angle;

        //COLOR
        if (typeof info.shape.color == "undefined") {
            console.log("The new color will be " + STATE.color);
            this.color = STATE.color;
        } else {
            this.color = info.shape.color;
        }
        this.fill = info.shape.fill;

        //STROKE (outline)
        if (info.shape.stroke) {
            this.stroke = true;
            this.strokeStyle = info.shape.stroke.strokeStyle;
            if (!info.shape.stroke.strokeColor) {
                this.strokeColor = this.color;
            } else {
                this.strokeColor = info.shape.stroke.strokeColor;
            }
        } else {
            this.stroke = false;
            this.strokeStyle = 2;
            this.strokeColor = this.color
        }

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
    

    //redraws the shape's graphic
    redrawGraphic: function() {
        this.createjsShape.graphics.clear();

        
        if(this.strokeStyle === "0"){
            this.stroke = false;
        } else {
            this.stroke = true;
        }

        if (this.fill && !this.stroke) {
            this.createjsShape.graphics
                .beginFill(this.color)
                .drawPolyStar(0, 0, this.radius, this.sides, this.pointSize, this.angle);

        } else if (!this.fill && this.stroke) {
            this.createjsShape.graphics
                .setStrokeStyle(this.strokeStyle)
                .beginStroke(this.strokeColor)
                .drawPolyStar(0, 0, this.radius, this.sides, this.pointSize, this.angle);
        } else {
            this.createjsShape.graphics
                .setStrokeStyle(this.strokeStyle)
                .beginStroke(this.strokeColor)
                .beginFill(this.color)
                .drawPolyStar(0, 0, this.radius, this.sides, this.pointSize, this.angle);
        }
        this.createjsShape.setBounds(0, 0, this.radius * 2, this.radius * 2);
    },

    getIndex: function() {
        return this.layer.elements['ids'].indexOf(this.id);
    },

    getElementProp: function() {
        return "polystar";
    }

});