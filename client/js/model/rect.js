var Rect = Class.create({

	//constructor
    initialize: function(info, layer) {
        this.id = STATE.getId(info.id);
        this.layer = layer;

        this.createjsShape = new createjs.Shape();
        this.toModel(info);

        layer.addElement(this); //will automatically set the correct index for this element

    },

    toJson: function(){
        var json =  {
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
                    "rect": {
                        "w": this.createjsShape.getBounds().width,
                        "h": this.createjsShape.getBounds().height,
                        "cornerRadius": this.cornerRadius
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
    toModel: function(info){
        
        this.w = info.shape.rect.w;
        this.h = info.shape.rect.h;

        if(!info.shape.rect.cornerRadius){
            this.cornerRadius = 1;
        } else 
            this.cornerRadius = info.shape.rect.cornerRadius;

        //COLOR
        if(!info.shape.color){
            this.color = STATE.color;
        } else {
            this.color = info.shape.color;
        }
        this.fill = info.shape.fill;        

        //STROKE (outline)
        if(info.shape.stroke){
            this.stroke = true;
            this.strokeStyle = info.shape.stroke.strokeStyle;
            if(!info.shape.stroke.strokeColor){
                this.strokeColor = this.color;
            } else {
                this.strokeColor = info.shape.stroke.strokeColor;
            }
        } else {
            this.stroke = false;
            this.strokeStyle = 2;
            this.strokeColor = this.color
        }
        
        //draw the actual shape
        this.redrawGraphic();

        this.createjsShape.regX = info.shape.rect.w/2;
        this.createjsShape.regY = info.shape.rect.h/2;

        this.createjsShape.x = info.x;
        this.createjsShape.y = info.y;

        if(info.transformations){
            if(info.transformations.rotation){
                this.createjsShape.rotation = info.transformations.rotation;
            }
            if(info.transformations.alpha){
                this.createjsShape.alpha = info.transformations.alpha;
            }
            if(info.transformations.scaleX){
                this.createjsShape.scaleX = info.transformations.scaleX;
            }
            if(info.transformations.scaleY){
                this.createjsShape.scaleY = info.transformations.scaleY;
            }
        }
    },

    redrawGraphic: function(){
        this.createjsShape.graphics.clear();

        if(this.strokeStyle === "0"){
            this.stroke = false;
        } else {
            this.stroke = true;
        }

        if(this.fill && !this.stroke){
            this.createjsShape.graphics
                .beginFill(this.color)
                .drawRect(0, 0, this.w, this.h);

        } else if(!this.fill && this.stroke){
            this.createjsShape.graphics
                .setStrokeStyle(this.strokeStyle)
                .beginStroke(this.strokeColor)
                .drawRect(0, 0, this.w, this.h);
                //.drawRoundRect(0, 0, this.w, this.h, this.cornerRadius);
        } else {
            this.createjsShape.graphics
                .setStrokeStyle(this.strokeStyle)
                .beginStroke(this.strokeColor)
                .beginFill(this.color)
                .drawRect(0, 0, this.w, this.h);
                //.drawRoundRect(0, 0, this.w, this.h, this.cornerRadius);
        }    
        this.createjsShape.setBounds(0,0,this.w,this.h);
    },

     getIndex:function(){
        return this.layer.elements['ids'].indexOf(this.id);
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

    getElementProp: function(){
        return "rect";
    }

});