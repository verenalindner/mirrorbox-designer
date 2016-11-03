var Texx = Class.create({

    //constructor
    initialize: function(info, layer) {
        this.id = STATE.getId(info.id);
        this.layer = layer;

        this.createjsShape = new createjs.Text();
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
                "text": {
                    "value": this.createjsShape.text,
                    "color": this.createjsShape.color,
                    "fontSize": this.fontSize,
                    "fontStyle": this.fontStyle,
                    "bold": this.bold,
                    "italic": this.italic,
                    "textAlign": this.createjsShape.textAlign
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

        this.fontSize = info.text.fontSize;
        this.fontStyle = info.text.fontStyle;
        this.bold = info.text.bold;
        this.italic = info.text.italic;
        //inherent in createjs this.align = info.text.valueAlign;

        var style = "";
        if (this.bold) style += " bold";
        if (this.italic) style += " italic";

        //draw the actual text
        this.createjsShape.text = info.text.value;
        this.createjsShape.font = style + " " + this.fontSize + "px " + this.fontStyle;
        this.createjsShape.color = info.text.color;
        this.createjsShape.textAlign = info.text.textAlign;

     /*   this.hit = new createjs.Shape();
        this.hit.graphics.beginFill("#000").drawRect(0, 0, this.createjsShape.getMeasuredWidth(), this.createjsShape.getMeasuredHeight());
        this.createjsShape.hitArea = hit;
*/
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

        this.createjsShape.regX = this.createjsShape.getMeasuredWidth() / 2;
        this.createjsShape.regY = this.createjsShape.getMeasuredWidth() / 2;

        this.createjsShape.x = info.x;
        this.createjsShape.y = info.y;
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
        var style = "";
        if (this.bold) style += " bold";
        if (this.italic) style += " italic";

        this.createjsShape.font = style + " " + this.fontSize + "px " + this.fontStyle;

        //this.createjsShape.setBounds(0,0,this.w,this.h);
    },

    getIndex: function() {
        return this.layer.elements['ids'].indexOf(this.id);
    },

    getElementProp: function() {
        return "text";
    }

});