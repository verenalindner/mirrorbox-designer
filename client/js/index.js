$(function() {


	//______________________________________________________________
	//GENRAL
	// all headlines. Content will "collapse on click" (Layer headlline, UI Elements,...)
	$(".collapsible").click(function() {
		if ($(this).siblings().is(":visible")) {
			$(this).children().toggleClass("ui-icon-triangle-1-s", false);
			$(this).children().toggleClass("ui-icon-triangle-1-w", true);
		} else {
			$(this).children().toggleClass("ui-icon-triangle-1-s", true);
			$(this).children().toggleClass("ui-icon-triangle-1-w", false);
		}
		$('progress').hide();
		$(this).siblings().slideToggle();
	});

	$("#check").button();

	$("#rightPanel").resizable({
		handles: "all"
	});

	$(function() {
		$("#tabs-min").tabs();
	});


	//______________________________________________________________
	//DIALOGS
	$("#newDialog").dialog({
		autoOpen: false,
		buttons: [{
			text: "Set",
			click: function() {
				console.log("input  value:" + $("#newDialog input").val() + ".");
				if ($("#newDialog input").val()) {
					newDoc($("#newDialog input").val());
					$(this).dialog("close");
				} else {
					$("#newDialog input").focus();
				}
			}
		}, {
			text: "Cancel",
			click: function() {
				$(this).dialog("close");
			}
		}]
	});

	$("#saveAsDialog").dialog({
		autoOpen: false,
		buttons: [{
			text: "Save",
			click: function() {
				if ($("#saveAsDialog input").val()) {
					saveAs($("#saveAsDialog input").val());
					$(this).dialog("close");
				} else {
					$("#saveAsDialog input").focus();
				}
			}
		}, {
			text: "Cancel",
			click: function() {
				$(this).dialog("close");
			}
		}]
	});

	$("#saveDialog").dialog({
		autoOpen: false,
		buttons: [{
			text: "Yes, Save",
			click: function() {
				save();
				$(this).dialog("close");
				$("#newDialog").dialog("open");
			}
		}, {
			text: "Yes, but Save As ...",
			click: function() {
				$(this).dialog("close");
				$("#saveAsDialog").dialog("open");
			}
		}, {
			text: "No, don't Save",
			click: function() {
				$(this).dialog("close");
				$("#newDialog").dialog("open");
			}
		}]
	});

	$("#loadDialog").dialog({
		autoOpen: false,
		buttons: [{
			text: "Open",
			click: function(evt) {
				var selectedVal = "";
				var selected = $("#loadDialog form input[type='radio']:checked");
				if (selected.length > 0) {
					selectedVal = selected.val();
					console.log("SELECTED " + selectedVal);
				}
				setSessionAndLoad(selectedVal);
				$(this).dialog("close");
			}
		}, {
			text: "Cancel",
			click: function() {
				$(this).dialog("close");
			}
		}]
	});


	//______________________________________________________________
	//TAB "FILE"

	$("#newbutton")
		.button({
			icons: {
				primary: "ui-icon-document"
			},
			text: false
		})
		.click(function() {
			if (STATE.saved) {
				$("#newDialog").dialog("open");
			} else {
				$("#saveDialog").dialog("open");
			}
		});

	$("#newIcon")
		.click(function() {
			if (STATE.saved) {
				$("#newDialog").dialog("open");
			} else {
				$("#saveDialog").dialog("open");
			}
		});

	$("#saveIcon")
		.click(function() {
			save();
		});

	$("#loadIcon")
		.click(function() {
			//load();
			getSessions();
		});

	$("#saveAsIcon")
		.click(function() {
			$("#saveAsDialog").dialog("open");
		});

	$("#savebutton")
		.button({
			icons: {
				primary: "ui-icon-disk"
			},
			text: false
		})
		.click(function() {
			save();
		});

	$("#loadbutton")
		.button({
			icons: {
				primary: "ui-icon-folder-open"
			},
			text: false
		})
		.click(function() {
			getSessions();
		});

	$(".plus").button({
		icons: {
			primary: "ui-icon-plus"
		},
		text: false
	});


	//______________________________________________________________
	//LAYER
	$("#sortableLayers")
		.sortable({
			update: function(event, ui) {
				console.log("Layer " + ui.item.context.id + " has changed to Position " + ui.item.index() + "!");

				//layer id is of the form "layer_id"
				var layerId = ui.item.context.id.split("_")[1];
				updateLayerIndex(layerId, ui.item.index());

			}
		})
		.on('click', ".layerBox", function() {
			console.log(this.id + " was clicked");
			$(this).children(":first").css("background", "#959595");
			$(this).siblings().children(":first").css("background", "#CBCBCB");

			STATE.selectedLayer = STATE.modelStage.layers["'" + this.id.split("_")[1] + "'"];
			console.log("SELECTED Layer IS " + STATE.selectedLayer);
		});


	$("#sortableLayers").on("click", ".layerToggle", function() {
		showLayer(this, this.checked);
	});

	//______________________________________________________________
	//ELEMENT CONTAINER (Left)

	

	var DELAY = 700;
	var clicks = 0,
		timer = null;
	$("#toolsImgContainer").on("click", "#rectTool", function() {
		clicks++; //count clicks
		if (clicks === 1) {
			timer = setTimeout(function() {

				console.log("Single Click"); //perform single-click action 
				fillSettingsTab("rect");
				clicks = 0; //after action performed, reset counter

			}, DELAY);
		} else {

			clearTimeout(timer); //prevent single-click action
			console.log("Double Click"); //perform double-click action
			getDefaultShape("rect");
			clicks = 0; //after action performed, reset counter
		}
	})
		.on("dblclick", "#rectTool", function(e) {
			e.preventDefault(); //cancel system double-click event
		});

	var circleClicks = 0,
		circleTimer = null;
	$("#toolsImgContainer").on("click", "#circleTool", function() {
		circleClicks++; //count clicks
		if (circleClicks === 1) {
			circleTimer = setTimeout(function() {

				console.log("Single Click"); //perform single-click action 
				fillSettingsTab("circle");
				circleClicks = 0; //after action performed, reset counter

			}, DELAY);
		} else {

			clearTimeout(circleTimer); //prevent single-click action
			console.log("Double Click"); //perform double-click action
			getDefaultShape("circle");
			circleClicks = 0; //after action performed, reset counter
		}
	})
		.on("dblclick", "#circleTool", function(e) {
			e.preventDefault();
		});


	var polyClicks = 0,
		polyTimer = null;
	$("#toolsImgContainer").on("click", "#polystarTool", function() {
		polyClicks++; //count clicks
		if (polyClicks === 1) {
			polyTimer = setTimeout(function() {

				console.log("Single Click");
				fillSettingsTab("polystar");
				polyClicks = 0;

			}, DELAY);
		} else {

			clearTimeout(polyTimer);
			console.log("Double Click");
			getDefaultShape("polystar");
			polyClicks = 0;
		}
	})
		.on("dblclick", "#polystarTool", function(e) {
			e.preventDefault();
		});

	var halfCClicks = 0,
		halfCTimer = null;
	$("#toolsImgContainer").on("click", "#halfCircleTool", function() {
		halfCClicks++; //count clicks
		if (halfCClicks === 1) {
			halfCTimer = setTimeout(function() {

				console.log("Single Click"); //perform single-click action 
				fillSettingsTab("halfCircle");
				halfCClicks = 0; //after action performed, reset counter

			}, DELAY);
		} else {

			clearTimeout(halfCTimer); //prevent single-click action
			console.log("Double Click"); //perform double-click action
			getDefaultShape("halfCircle");
			halfCClicks = 0; //after action performed, reset counter
		}
	})
		.on("dblclick", "#halfCircleTool", function(e) {
			e.preventDefault();
		});

	var imgClicks = 0,
		imgTimer = null;
	$("#guiImgContainer").on("click", "img", function() {
		imgClicks++; //count clicks
		if (imgClicks === 1) {
			imgTimer = setTimeout(function() {

				console.log("Single Click"); //perform single-click action 
				fillSettingsTab("img");
				imgClicks = 0; //after action performed, reset counter

			}, DELAY);
		} else {
			clearTimeout(imgTimer); //prevent single-click action
			console.log("Double Click"); //perform double-click action
			getImg(this.src);
			imgClicks = 0; //after action performed, reset counter
		}
	})
		.on("dblclick", "img", function(e) {
			e.preventDefault();
		});

	var imgClicks = 0,
		imgTimer = null;
	$("#iconImgContainer").on("click", "img", function() {
		imgClicks++; //count clicks
		if (imgClicks === 1) {
			imgTimer = setTimeout(function() {

				console.log("Single Click"); //perform single-click action 
				fillSettingsTab("img");
				imgClicks = 0; //after action performed, reset counter

			}, DELAY);
		} else {
			clearTimeout(imgTimer); //prevent single-click action
			console.log("Double Click"); //perform double-click action
			getImg(this.src);
			imgClicks = 0; //after action performed, reset counter
		}
	})
		.on("dblclick", "img", function(e) {
			e.preventDefault();
		});



	$("#toolsImgContainer").on('click', "#textTool", function() {
		getDefaultShape("text");
	});

	$("#customShapeContainer").on('click', ".customShape", function() {
		console.log("get custom shape with name " + this.id);
		getCustomShape(this.id);
	});

	$("#uploadFile").change(function() {
		uploadFile();
	});


	//______________________________________________________________
	//TAB "View" 

	$("#showLayerBorder").on('change', function(event) {
		// console.log("showLayerBorder clicked "+this.checked);
		toggleLayerBorders(this.checked);
		if (this.checked) {
			$(this).next().children().attr("src", "./img/gui/appbar.eye.hide.png");
			$(this).next().next().html("Hide Layer Borders");
		} else {
			$(this).next().children().attr("src", "./img/gui/appbar.eye.png");
			$(this).next().next().html("Show Layer Borders");
		}
	});

	$("#hReferenceLineImg").click(function(evt) {
		addReferenceLine();
	});

	$("#vReferenceLineImg").click(function(evt) {
		addVReferenceLine();
	});

	$("#showLines").change(function(evt) {
		$("#canvas").siblings().toggle(this.checked);
		$(this).toggleClass("checked", this.checked);

		if (this.checked) {
			$(this).next().children().attr("src", "./img/gui/appbar.eye.hide.png");
			$(this).next().next().html("Hide Reference Lines");
		} else {
			$(this).next().children().attr("src", "./img/gui/appbar.eye.png");
			$(this).next().next().html("Show Reference Lines");
		}
		// console.log("Show lines "+this.checked);
	});

	$("#zoomIn").click(function() {
		STATE.stage.scaleX += 0.2;
		STATE.stage.scaleY += 0.2;

		updateCanvasSize();

		console.log("ZOOM!");
	});

	$("#zoomOut").click(function() {
		STATE.stage.scaleX -= 0.2;
		STATE.stage.scaleY -= 0.2;

		updateCanvasSize();

		console.log("ZOOM!");
	});

	$("#zoomNormal").click(function() {
		STATE.stage.scaleX = 1;
		STATE.stage.scaleY = 1;

		updateCanvasSize();

		console.log("ZOOM!");
	});


	//______________________________________________________________
	//TAB "Arrange" 

	$("#shapeDialog").dialog({
		autoOpen: false,
		buttons: [{
			text: "Create",
			click: function() {
				if ($("#shapeDialog input").val()) {
					newCustomShape($("#shapeDialog input").val(), STATE.selectedElement.parent);
					console.log("NEW CUSTOM ELEMENT with name " + $("#shapeDialog input").val());
					$(this).dialog("close");
				} else {
					$("#shapeDialog input").focus();
				}
			}
		}, {
			text: "Cancel",
			click: function() {
				$(this).dialog("close");
			}
		}]
	});

	$("#newCustomShape").click(function() {
		if (STATE.selectedElement) {
			$("#shapeDialog").dialog("open");
		}
	});


	$("#showStaple").change(function() {
		changeView(this.checked);
		$(this).toggleClass("checked", this.checked);

		if (this.checked) {
			$(this).next().children().attr("src", "./img/gui/appbar.onstaple.png");
			$(this).next().next().html("Show each Layer explicitly");
		} else {
			$(this).next().children().attr("src", "./img/gui/appbar.staple.png");
			$(this).next().next().html("Show Layers stapled");
		}
	});

	$("#groupElements").click(function(evt) {
		$(this).toggleClass("checked", true);
		groupElements();
	});

	$("#ungroupElements").click(function(evt) {
		ungroupElements();
	});


	$("#duplicateElement").click(function(evt) {
		if (STATE.selectedElement) {
			duplicatElement();
		}
	});


	//______________________________________________________________
	//TAB "Edit" 

	$(".currentColor").colpick({
		color: "rgb(0, 255, 255)",
		onHide: function() {
			console.log("submit");
			$(".colorbox").append('<div class="color" style="background-color:' + $(".currentColor").css("background-color") + ' "> </div>');

			$(".color").click(function() {
				if (STATE.selectedElement) {
					var prop = STATE.selectedElement.parent.getElementProp();
					if (prop === "polystar" || prop == "circle" || prop === "rect" || prop === "line" || prop === "halfCircle" || prop === "text") {
						changeColorSettings($(this).css("background-color"));
						$("#fillColorBox")
							.colpick({
								color: '#' + hex
							})
							.css('background-color', '#' + hex);
					}
				}
			});
		},
		onChange: function(hsb, hex, rgb, el, bySetColor) {
			$(".currentColor").css('background', '#' + hex);
			$("#fillColorBox")
				.colpick({
					color: '#' + hex
				})
				.css('background-color', '#' + hex);

			if (STATE) {

				if (STATE.selectedElement) {
					var prop = STATE.selectedElement.parent.getElementProp();
					if (prop === "polystar" || prop == "circle" || prop === "rect" || prop === "line" || porp === "halfCircle" || prop === "text") {
						changeColorSettings('#' + hex);
					}
				}
			}

			STATE.color = '#' + hex;

			// Fill the text box just if the color was set using the picker, and not the colpickSetColor function.
			if (!bySetColor) $(el).val(hex);
			if (STATE.selectedElement) updateElement(STATE.selectedElement.parent);
		}
	})
		.css('background-color', "rgb(0, 255, 255)");

	$(".color").click(function() {
		if (STATE.selectedElement) {
			var prop = STATE.selectedElement.parent.getElementProp();
			if (prop === "polystar" || prop == "circle" || prop === "rect" || prop === "line" || porp === "halfCircle" || prop === "text") {
				changeColorSettings($(this).css("background-color"));
				$("#fillColorBox")
					.colpick({
						color: '#' + hex
					})
					.css('background-color', '#' + hex);
			}
		}
	});

});