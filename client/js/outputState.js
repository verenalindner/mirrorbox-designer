var State = Class.create({

	//constructor
  	initialize: function(modelStage) {
      //the Stage that is defined in the MirrorBox
      this.modelStage = modelStage;

      //the stage that is definded by createjs
      this.stage = modelStage.createjsStage;

      this.id = 1;
      this.allIds = new Array();

      //TODO set dynamicallly
      this.layerWidth = 510;
      this.layerHeight = 250;
      this.layerCount = 3;
  	},
    
    getId: function(id){
      var id = parseInt(id);
      if(typeof id != "undefined" && id > 0){
        this.allIds.push(parseInt(id));
        return id;
      }
      //find unique id
      while(this.allIds.indexOf(this.id) > -1){
          this.id += 1;
      }
      this.allIds.push(this.id);
      return this.id;
    },

    reset: function(){
      this.modelStage.reset();
      this.id = 1;
      this.allIds = new Array();
    },

    setSelectedElement: function(){
      //only here because layer calls this method. not relevant for output
    },

    fillEmptyStage: function(){
        for(var i=0; i<this.layerCount; i++){
          var layer = new Layer();
        }
        changeView(this.stapleView);
    },
});