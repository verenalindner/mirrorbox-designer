var State = Class.create({

    //constructor
    initialize: function(modelStage) {
        //the Stage that is defined in the MirrorBox
        this.modelStage = modelStage;

        //the stage that is definded by createjs
        this.stage = modelStage.createjsStage;
        this.selectedLayer = null;
        this.selectedElement = null;
        this.color = '#0000ff';

        this.stapleView = false;
        this.editable = true;

        this.saved = true;

        this.id = 1;
        this.allIds = new Array();

        // this.init();
        /*
      //TODO
      this.layerWidth = 473;
      this.layerHeight = 207;

      //contains all ids
      this.id = 1;
      this.allIds = new Array();

      this.customImgs = new Array();
      this.predefinedImgs = new Array();
*/
    },

    getId: function(id) {
        var id = parseInt(id);
        if (typeof id != "undefined" && id > 0) {
            this.allIds.push(parseInt(id));
            return id;
        }
        //find unique id
        while (this.allIds.indexOf(this.id) > -1) {
            this.id += 1;
        }
        this.allIds.push(this.id);
        return this.id;
    },

    init: function() {
        this.modelStage.reset();
        this.selectedLayer = null;
        this.selectedElement = null;
        this.id = 1;
        this.allIds = [];
        this.saved = true;
        getDefaultSettings(); //will call setDefaults          
    },

    setDefaults: function(defaults) {
        this.color = defaults.color;
        var layerInfo = defaults.layerInfo;
        this.layerWidth = layerInfo.w;
        this.layerHeight = layerInfo.h;
        this.layerCount = layerInfo.count;
    },

    //move
    fillEmptyStage: function() {
        //empty layers on GUI
        $("#sortableLayers").empty();
        for (var i = 0; i < this.layerCount; i++) {
            var layer = new Layer();
            $("#sortableLayers").append(layer.toHTML());
           
            $("#layer_" + layer.id + " .delete").click(function(evt) {
                console.log("delete layer");
                removeLayer(layer);
            });
        }


        changeView(this.stapleView);
        this.saved = true;
    },

    setSelectedElement: function(element) {
        if (this.selectedElement) {
            var oldElem = this.selectedElement.parent;
            this.selectedElement.updateParent(element);
            
            if (oldElem != element) {
                fillSettingsTab(element.getElementProp(), element);
                
            }
        } else {
            console.log("mousedown");
            // STATE.selectedElement = new selectedElementent(element);
            this.selectedElement = new SelectedElement(element);
            fillSettingsTab(element.getElementProp(), element);
        }

        $("#element_" + element.id).css("background", "whitesmoke");
        $("#element_" + element.id).siblings().css("background", "#e3e6e6");
        $("#layer_" + element.layer.id).children(":first").css("background", "rgb(149, 149, 149)");
    },

    removeSelectedElement: function(element) {
        if (this.selectedElement) {
            this.selectedElement.removeSelected();
        }
        this.selectedElement = null;
    },

    forAllLayers: function(task) {
        var layers = this.modelStage.layers;
        for (var i = 0; i < layers.length; i++) {
            task();
        }
    }


});