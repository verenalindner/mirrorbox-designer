var Element = Class.create({

	//constructor
  	initialize: function(layer, x, y) {
      this.index;
    	layer.addElement(this); //will automatically set the correct index for this element

      this.createjsShape = new createjs.Shape();

      this.x = x;
      this.y = y;   	

  	},

	

});

