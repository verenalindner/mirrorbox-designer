var Stage = Class.create({

  //constructor
  initialize: function() {

    //actual visual respresantation
    this.createjsStage = new createjs.Stage(canvas);

    //old: this.layers = new Array();
    //object in which all layers are stored that can be accessed via id
    this.layers = {};
    this.layers["ids"] = [];
  },

  // adds a layer to stage and automatically sets the index of the layer element
  addLayer: function(layer) {
    layer.index = this.layers["ids"].length;

    //old: this.layers.push(layer);
    this.layers["'" + layer.id + "'"] = layer;
    this.layers["ids"].push(layer.id);

    // adds the layer at the beginning of the List (so it will be in the background)
    this.createjsStage.addChildAt(layer.createjsLayer, 0);

    console.log("Layer added to the Stage");
    console.log(this.createjsStage.getNumChildren());
    STATE.selectedLayer = layer;
  },

  removeLayer: function(layer) {
    console.log("ids before "+this.layers["ids"]);

    //remove id from array
    for (var i = 0; i < this.layers["ids"].length; i++) {
      if (layer.id == this.layers["ids"][i]) {
        this.layers["ids"].splice(i, 1);
        break;
      }
    }

    //remove link
    delete this.layers["'" + layer.id + "'"];

    //remove all Children 
    layer.createjsLayer.removeAllChildren();

    //remove createjs representation
    this.createjsStage.removeChild(layer.createjsLayer);

    console.log("ids after "+this.layers["ids"]);
  },

  changeLayerIndex: function(layerId, newIndex) {

    var stageNumChildren = this.createjsStage.getNumChildren();

    //TODO make this nicer!!! the elements that are for the display of the border need to be removed
    if (STATE.selectedElement)
      stageNumChildren -= 1;

    var layer = this.layers["'" + layerId + "'"];

    var stageIndex = stageNumChildren - newIndex - 1;
    var oldIndex = stageNumChildren - 1 - this.createjsStage.getChildIndex(layer.createjsLayer);

    console.log("setting layer" + layerId + " from " + oldIndex + " to new index: " + newIndex);
    console.log("BEFORE move stage layers :" + STATE.modelStage.layers.ids.toString());
    this.layers.ids.move(oldIndex, newIndex);
    console.log("AFTER move stage layers :" + STATE.modelStage.layers.ids.toString());


    //createjs children are displayed in opposite index direction
    this.createjsStage.setChildIndex(layer.createjsLayer, stageIndex);

    if (!STATE.stapleView) {
      changeView(false);
    }

  },

  reset: function() {
    this.layers = {};
    this.layers["ids"] = new Array();
    this.createjsStage.clear();
    this.createjsStage.removeAllChildren();
  }



});