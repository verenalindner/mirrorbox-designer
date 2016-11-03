var SelectedElement = Class.create({

	//constructor
	initialize: function(parent) {

		console.log("selected element with id " + parent.id);

		var that = this;
		this.parent = parent;
		//this.border;
		this.width = 0;
		this.height = 0;

		//offset is neede because the lements are stored in layers 
		this.offset = 0;

		this.controlPoints = [];

		//controlPointWidth
		cW = 20;

		//TOP-LEFT
		this.c1 = new createjs.Shape();
		this.c1.graphics.beginFill('#cccccc').drawRect(0, 0, cW, cW);
		this.c1.regX = cW / 2;
		this.c1.regY = cW / 2;

		this.c1.on("pressmove", function(evt) {
			var startX = that.parent.createjsShape.x + that.width / 2;
			var startY = that.parent.createjsShape.y + that.height / 2;

			var myScaleX = (evt.stageX - startX) / that.width;
			var myScaleY = (evt.stageY - startY) / that.height;

			if(myScaleX > 0.1){
				myScaleX = 0.1;
			} if (myScaleY > 0.1){
				myScaleX = 0.1;
			}

			// console.log("(" + evt.stageX + " - " + startX + ") / " + that.width + ")");

			that.parent.createjsShape.scaleX = -myScaleX;
			that.parent.createjsShape.scaleY = -myScaleY;

			that.setScale(-myScaleX, -myScaleY);
			updateElement(that.parent);
		});

		this.controlPoints.push(this.c1);

		//TOP_RIGHT
		this.c2 = new createjs.Shape(); /**/
		this.c2.graphics.beginFill('#cccccc').drawRect(0, 0, cW, cW);
		this.c2.regX = cW / 2;
		this.c2.regY = cW / 2;

		this.c2.on("pressmove", function(evt) {
			console.log("c2");
			var startX = that.parent.createjsShape.x - that.width / 2;
			var startY = that.parent.createjsShape.y + that.height / 2;

			var myScaleX = (evt.stageX - startX) / that.width;
			var myScaleY = (evt.stageY - startY) / that.height;

			if(myScaleX < 0.1){
				myScaleX = 0.1;
			} if (myScaleY > 0.1){
				myScaleX = 0.1;
			}

			that.parent.createjsShape.scaleX = myScaleX;
			that.parent.createjsShape.scaleY = -myScaleY;

			that.setScale(myScaleX, -myScaleY);
			updateElement(that.parent);
		});

		this.controlPoints.push(this.c2);

		//BOTTOM_LEFT
		this.c3 = new createjs.Shape();
		this.c3.graphics.beginFill('#cccccc').drawRect(0, 0, cW, cW);
		this.c3.regX = cW / 2;
		this.c3.regY = cW / 2;

		this.c3.on("pressmove", function(evt) {
			console.log("c3");
			var startX = that.parent.createjsShape.x - that.width / 2;
			var startY = that.parent.createjsShape.y - that.height / 2;

			var myScaleX = (evt.stageX - startX) / that.width;
			var myScaleY = (evt.stageY - startY) / that.height;

			if(myScaleX < 0.1){
				myScaleX = 0.1;
			} if (myScaleY < 0.1){
				myScaleX = 0.1;
			}

			that.parent.createjsShape.scaleX = myScaleX;
			that.parent.createjsShape.scaleY = myScaleY;

			that.setScale(myScaleX, myScaleY);
			updateElement(that.parent);
		});
		this.controlPoints.push(this.c3);

		//BOTTOM_RIGHT
		this.c4 = new createjs.Shape();
		this.c4.graphics.beginFill('#cccccc').drawRect(0, 0, cW, cW);
		this.c4.regX = cW / 2;
		this.c4.regY = cW / 2;

		this.c4.on("pressmove", function(evt) {
			console.log("c4");
			var startX = that.parent.createjsShape.x + that.width / 2;
			var startY = that.parent.createjsShape.y - that.height / 2;

			var myScaleX = (evt.stageX - startX) / that.width;
			var myScaleY = (evt.stageY - startY) / that.height;

			if(myScaleX > 0.1){
				myScaleX = 0.1;
			} if (myScaleY < 0.1){
				myScaleX = 0.1;
			}

			that.parent.createjsShape.scaleX = -myScaleX;
			that.parent.createjsShape.scaleY = myScaleY;

			that.setScale(-myScaleX, myScaleY);
			updateElement(that.parent);
		});
		this.controlPoints.push(this.c4);

		this.container = new createjs.Container();

		this.updateParent(this.parent);

	},

	setScale: function(sx, sy) {
		this.container.scaleX = sx;
		this.container.scaleY = sy;

		this.c1.scaleX = 1 / sx;
		this.c1.scaleY = 1 / sy;

		this.c2.scaleX = 1 / sx;
		this.c2.scaleY = 1 / sy;

		this.c3.scaleX = 1 / sx;
		this.c3.scaleY = 1 / sy;

		this.c4.scaleX = 1 / sx;
		this.c4.scaleY = 1 / sy;

		updateScaleFields(sx, sy);
	},

	updateParent: function(newParent) {
		this.parent = newParent;

		if (!this.border) {
			this.border = new createjs.Shape();
			this.container = new createjs.Container();
			this.container.addChild(this.border);
			this.container.addChild(this.c1);
			this.container.addChild(this.c2);
			this.container.addChild(this.c3);
			this.container.addChild(this.c4);
			STATE.stage.addChild(this.container);
		} else {
			this.border.graphics.clear();
		}

		if (!STATE.stapleView) {
			this.offset = this.parent.layer.getIndex() * STATE.layerHeight;
		}

		var bounds = this.parent.createjsShape.getBounds();
		if (this.parent.getElementProp() == "text") {
			bounds = {
				"width": this.parent.createjsShape.getMeasuredWidth(),
				"height": this.parent.createjsShape.getMeasuredHeight()
			};

			this.parent.createjsShape.regX = this.parent.createjsShape.getMeasuredWidth() / 2;
			this.parent.createjsShape.regX = this.parent.createjsShape.getMeasuredWidth() / 2;
		}

		this.width = bounds.width; //* this.parent.createjsShape.scaleX;
		this.height = bounds.height; // * this.parent.createjsShape.scaleY;

		var parentX = newParent.createjsShape.x;
		var parentY = newParent.createjsShape.y + this.offset;


		this.border.graphics.beginStroke('#cccccc').drawRect(0, 0, this.width, this.height);
		this.border.regX = this.width / 2;
		this.border.regY = this.height / 2;

		this.container.x = parentX;
		this.container.y = parentY;

		this.setScale(this.parent.createjsShape.scaleX, this.parent.createjsShape.scaleY);

		this.c1.x = -this.width / 2;
		this.c1.y = -this.height / 2;

		this.c2.x = +this.width / 2;
		this.c2.y = -this.height / 2;

		this.c3.x = +this.width / 2;
		this.c3.y = +this.height / 2;

		this.c4.x = -this.width / 2;
		this.c4.y = +this.height / 2;

		this.container.rotation = this.parent.createjsShape.rotation;

		that = this;

		this.parent.createjsShape.on("pressmove", handlePressmove);

		function handlePressmove(evt) {
			console.log("pressmove");

			var newX = evt.stageX;
			var newY = evt.stageY;

			if (that.parent.mask) {
				that.parent.createjsShape.mask.x = newX;
				that.parent.createjsShape.mask.y = newY - that.offset;
			}

			that.container.x = newX;
			that.container.y = newY;

			that.parent.createjsShape.x = newX;
			that.parent.createjsShape.y = newY - that.offset;

			updatePositionFields(that.parent.createjsShape.x, that.parent.createjsShape.y);
		}

		this.parent.createjsShape.on("pressup", function(evt) {
			this.parent.removeEventListener("pressmove", handlePressmove);
			updateElement(that.parent);
			that.checkElementPosition();
			//checkForOverlap();	
			//fillSettingsTab(that.parent.getElementProp(), that.parent);																		
		});

	},

	removeSelected: function() {
		STATE.stage.removeChild(this.container);
		// for (var i = 0; i < this.controlPoints.length; i++) {
		// 	STATE.stage.removeChild(this.controlPoints[i]);
		// }
	},

	checkElementPosition: function() {
		// if (this.parent.createjsShape.x < 1 || this.parent.createjsShape.x > STATE.layerWidth) {
		// 	this.parent.layer.removeElement(this.parent);
		// }

		//TODO switch to arbitrary layer
		if (this.parent.createjsShape.y < 0) {
			var layerId = STATE.modelStage.layers["ids"][this.parent.layer.getIndex() - 1];
			switchElementHtmlLayer(this.parent, layerId);

			var oldIndex = this.parent.layer.getIndex();
			var oldLayerId = this.parent.layer.id;
			this.parent.layer.switchElementLayer(this.parent, oldIndex - 1);
			updateElementIndex(this.parent, -1, oldLayerId);
		} else if (this.parent.createjsShape.y > STATE.layerHeight) {
			var layerId = STATE.modelStage.layers["ids"][this.parent.layer.getIndex() + 1];
			switchElementHtmlLayer(this.parent, layerId);

			var oldIndex = this.parent.layer.getIndex();
			var oldLayerId = this.parent.layer.id;
			this.parent.layer.switchElementLayer(this.parent, oldIndex + 1);
			updateElementIndex(this.parent, -1, oldLayerId)
		}
	},



});