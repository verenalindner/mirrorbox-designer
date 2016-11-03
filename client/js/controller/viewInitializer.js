var STATE;
var parser;
var update = true;
var previewStage;
var possibleSettings = {};
var hRefLineCount = 0; // count of horizontal reference lines

var toolQueue, iconQueue, uiElemQueue, customImgQueue, manifest;

function init() {
    //initialize state
    var modelStage = new Stage(document.getElementById("canvas"));
    STATE = new State(modelStage);
    STATE.stage = modelStage.createjsStage;

    /*STATE.helperStage = new Stage(document.getElementById("helperCanvas"));
    STATE.helperStage.createjsStage.width = $(canvasContainer).width();
    STATE.helperStage.createjsStage.height = $(canvasContainer).height();*/
    previewStage = STATE.stage.clone();
    previewStage.canvas = document.getElementById("preview");
    previewStage.scaleY = previewStage.scaleX = 0.4;


    // enable touch interactions if supported on the current device:
    createjs.Touch.enable(STATE.stage);

    // enabled mouse over / out events
    STATE.stage.enableMouseOver(10);
    STATE.stage.mouseMoveOutside = true; // keep tracking the mouse even when it leaves the canvas                                                              

    //queue IMGS
    manifest = [];
    manifest.push({
        id: "rectTool",
        src: "../img/tools/rect.png"
    });
    manifest.push({
        id: "circleTool",
        src: "../img/tools/ellipse.png"
    });
    manifest.push({
        id: "lineTool",
        src: "../img/tools/line.png"
    });
    manifest.push({
        id: "polystarTool",
        src: "../img/tools/polystar.png"
    });
    manifest.push({
        id: "halfCircleTool",
        src: "../img/tools/halfCircle.png"
    });
    manifest.push({
        id: "textTool",
        src: "../img/tools/text.png"
    });

    toolQueue = new createjs.LoadQueue(false);
    toolQueue.on("fileload", handleToolFileLoad, this);
    toolQueue.on("complete", handleToolComplete, this);
    toolQueue.on("error", handleError, this);
    toolQueue.setMaxConnections(manifest.length + 1);
    toolQueue.loadManifest(manifest);
}

function handleError(event) {
    console.log("Error while loading the resource " + event.item);
}

function handleToolFileLoad(event) {
    var item = event.item;
    var result = event.result;

    result.id = item.id;
    $("#toolsImgContainer").append(result);
}

function handleToolComplete(event) {
    manifest = [];
    postGetRequest(getFoldlerContentPath, "ui-elements", handleGetUiElements);
}

//_____________________________________________
// UI ELEMENTS
function handleGetUiElements(files) {
    for (var i = 1; i < files.length; i++) {
        if (files[i].name.indexOf(".png") < 0) {
            console.log("What a file? " + files[i].name);
            continue;
        }
        var imgCall = {
            id: files[i].name,
            src: "../img/ui-elements/" + files[i].name
        };
        manifest.push(imgCall);
    }

    uiElemQueue = new createjs.LoadQueue(false);
    uiElemQueue.on("fileload", handleUiElemFileLoad, this);
    uiElemQueue.on("complete", handleUiElemComplete, this);
    uiElemQueue.on("error", handleError, this);
    uiElemQueue.setMaxConnections(manifest.length + 1);
    uiElemQueue.loadManifest(manifest);
}

function handleUiElemFileLoad(event) {
    var item = event.item;
    var result = event.result;

    result.id = item.src;
    $("#guiImgContainer").append(result);
}

function handleUiElemComplete(event) {
    manifest = [];
    postGetRequest(getFoldlerContentPath, "ui-icons", handleGetIconElements);
}


//_____________________________________________
// ICONS
function handleGetIconElements(files) {
    for (var i = 1; i < files.length; i++) {
        if (files[i].name.indexOf(".png") < 0) {
            console.log("What a file?" + files[i].name);
            continue;
        }
        var imgCall = {
            id: "uiIcon" + i,
            src: "../img/ui-icons/" + files[i].name
        };
        manifest.push(imgCall);
    }

    iconQueue = new createjs.LoadQueue(false);
    iconQueue.on("fileload", handleIconFileLoad, this);
    iconQueue.on("complete", handleIconComplete, this);
    iconQueue.on("error", handleError, this);
    iconQueue.setMaxConnections(manifest.length + 1);
    iconQueue.loadManifest(manifest);
}

function handleIconFileLoad(event) {
    var item = event.item;
    var result = event.result;

    result.id = item.src;
    $("#iconImgContainer").append(result);
}

function handleIconComplete(event) {
    manifest = [];
    postGetRequest(getFoldlerContentPath, "custom-imgs", handleGetCustomImgs);
}

//_____________________________________________
//CUSTOM-ELEMENTS
function handleGetCustomImgs(files) {
    for (var i = 1; i < files.length; i++) {
        if (files[i].name.indexOf(".png") < 0 && files[i].name.indexOf(".jpeg") < 0 && files[i].name.indexOf(".jpg") < 0 && files[i].name.indexOf(".gif") < 0) {
            console.log("What a file?" + files[i].name);
            continue;
        }
        var imgCall = {
            id: "customImg_" + i,
            src: "../img/custom-imgs/" + files[i].name
        };
        manifest.push(imgCall);
    }


    customImgQueue = new createjs.LoadQueue(false);
    customImgQueue.on("fileload", handleCustomFileLoad, this);
    customImgQueue.on("complete", handleAllComplete, this);
    customImgQueue.on("error", handleError, this);
    customImgQueue.setMaxConnections(manifest.length + 1);
    customImgQueue.loadManifest(manifest);
}

function handleCustomFileLoad(event) {
    var item = event.item;
    var result = event.result;

    result.id = item.src;
    $("#customImgContainer").append(result);
}


//INIT SETTINGS
function handleAllComplete(event) {
    manifest = [];

    STATE.stage.addEventListener("stagemousedown", function(event) {
        console.log("HIT AT " + event.stageX + ", " + event.stageY);
        if (!STATE.stage.getObjectUnderPoint(event.stageX, event.stageY)) {
            STATE.removeSelectedElement();
            $("#editSettings").empty();
        }
    });



    $(".imgContainer img").draggable({
        opacity: 0.8,
        helper: "clone",
        start: function(event, ui) {
            //Set it to the front
            $(ui.helper[0]).css({
                "z-index": 10,
                "border": "none"
            });
        },
        stop: function(event, ui) {
            console.log("Stopped at position " + event.toElement.id);
        }
    });

    $("#canvas").droppable({
        // accept: ".imgContainer img",
        accept: ".imgContainer img, .imgContainer div",
        drop: function(event, ui) {
            var draggedId = ui.draggable[0].id;
            var draggedClass = ui.draggable[0].className;

            var canvasOffset = $("#canvas").offset();
            var elementPosition = [ui.offset.left - canvasOffset.left, ui.offset.top - canvasOffset.top];
            var newElemLayerIndex = 0;

            //check into which layer element should be dropped
            if (elementPosition[1] > STATE.layerHeight) {
                console.log("dropped at a layer lower than 1! " + elementPosition[1] + " > 302");
                newElemLayerIndex = Math.floor(elementPosition[1] / STATE.layerHeight);
                elementPosition[1] = elementPosition[1] % STATE.layerHeight;
            }
            //make sure Element is dropped at correct layer 
            console.log("element Position " + elementPosition + ", layerHeight " + STATE.layerHeight + ", layer index " + newElemLayerIndex);


            var layerId = STATE.modelStage.layers["ids"][newElemLayerIndex];
            console.log("layer index id is " + layerId + " out of ids " + STATE.modelStage.layers["ids"]);
            var layer = STATE.modelStage.layers["'" + layerId + "'"];

            handleImgDropped(elementPosition, layer, draggedId, draggedClass);
        }
    });

    //add array funtionality
    Array.prototype.move = function(old_index, new_index) {
        if (new_index >= this.length) {
            var k = new_index - this.length;
            while ((k--) + 1) {
                this.push("undefined");
            }
        }
        var changedValue = this.splice(old_index, 1)[0];
        this.splice(new_index, 0, changedValue);
        if (typeof this[0] == "undefined")
            this.splice(0, 1);
    };

    $("#guiImgContainer").append("<div class='break'></div>");
    $("#iconImgContainer").append("<div class='break'></div>");
    $('progress').hide();

    initAllSettings();

    newDoc("InternBackupFile");
    changeView();

    createjs.Ticker.addEventListener("tick", tick);
}

function tick(event) {
    if (update) {
        STATE.stage.update(event);
    }
}

function getParser(editable) {
    if (!parser) {
        return new Parser(editable);
    } else {
        return parser;
    }
}