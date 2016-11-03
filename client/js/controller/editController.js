//EDITSETTINGS________________________________________________--
//displays the correct settings 
function fillSettingsTab(elementKind, element) {

	$('#tabs-min').tabs({
		active: 2
	});


	$("#editSettings").empty();
	var kindSettings = possibleSettings[elementKind];
	for (var i = 0; i < kindSettings.length; i++) {
		$("#editSettings").append(kindSettings[i]);
	}

	initEdits();
	fillTabSettingsValues(elementKind, element);
}

function fillTabSettingsValues(kind, element) {

	elemJson = element.toJson().element;
	switch (kind) {
		case "circle":
			if (element) {
				fillCircleTabSettings(elemJson);
			} else {
				postGetRequest(getDefaultShapePath, "circle", fillCircleTabSettings);
			}
			break;
		case "rect":
			if (element) {
				fillRectTabSettings(elemJson);
			} else {
				postGetRequest(getDefaultShapePath, "rect", fillRectTabSettings);
			}
			break;
		case "polystar":
			if (element) {
				fillPolystarTabSettings(elemJson);
			} else {
				postGetRequest(getDefaultShapePath, "polystar", fillPolystarTabSettings);
			}

			break;
		case "img":
			if (element) {
				fillImgTabSettings(elemJson);
			} else {
				postGetRequest(getDefaultImagePath, "src", fillImgTabSettings);
			}
			break;
		case "text":
			if (element) {
				fillTextTabSettings(elemJson);
			} else {
				postGetRequest(getDefaultTextPath, "text", fillImgTabSettings);
			}
			break;
		case "line":
			if (element) {
				fillLineTabSettings(elemJson);
			} else {
				postGetRequest(getDefaultShapePath, "line", fillLineTabSettings);
			}
			break;
		case "halfCircle":
			if (element) {
				fillHalfCircleTabSettings(elemJson);
			} else {
				postGetRequest(getDefaultShapePath, "halfCircle", fillHalfCircleTabSettings);
			}
			break;
		case "group":
			if (element) {
				fillGroupTabSettings(elemJson);
			} else {
				postGetRequest(getDefaultShapePath, "group", fillGroupTabSettings);
			}
			break;
		default:
			fillGeneralSettings();
	}
}

function fillCircleTabSettings(json) {
	fillScaleSettings(json.transformations.scaleX, json.transformations.scaleY);
	fillAlphaSettings(json.transformations.alpha);
	fillRotationSettings(json.transformations.rotation);
	fillFillSettings(json.shape.fill);
	fillOutlineSettings(json.shape.stroke);
	fillPositionSettings([json.x, json.y]);
	fillRadiusSettings(json.shape.circle.radius);
	fillColorSettings(json.shape.color);
}

function fillRectTabSettings(json) {
	fillScaleSettings(json.transformations.scaleX, json.transformations.scaleY);
	fillAlphaSettings(json.transformations.alpha);
	fillRotationSettings(json.transformations.rotation);
	fillFillSettings(json.shape.fill);
	fillOutlineSettings(json.shape.stroke);
	fillPositionSettings([json.x, json.y]);
	fillSizeSettings([json.shape.rect.w, json.shape.rect.h]);
	fillColorSettings(json.shape.color);
}

function fillPolystarTabSettings(json) {
	fillScaleSettings(json.transformations.scaleX, json.transformations.scaleY);
	fillAlphaSettings(json.transformations.alpha);
	fillRotationSettings(json.transformations.rotation);
	fillFillSettings(json.shape.fill);
	fillOutlineSettings(json.shape.stroke);
	fillPositionSettings([json.x, json.y]);
	fillColorSettings(json.shape.color);
	fillRadiusSettings(json.shape.polystar.radius);
	fillSidesSettings(json.shape.polystar.sides);
	fillPointSizeSettings(json.shape.polystar.pointSize);
	fillAngleSettings(json.shape.polystar.angle);
}

function fillImgTabSettings(json) {
	fillScaleSettings(json.transformations.scaleX, json.transformations.scaleY);
	fillAlphaSettings(json.transformations.alpha);
	fillRotationSettings(json.transformations.rotation);
	fillPositionSettings([json.x, json.y]);
	//fillSizeSettings([json.shape.rect.w, json.shape.rect.h]);
}

function fillLineTabSettings(json) {
	fillScaleSettings(json.transformations.scaleX, json.transformations.scaleY);
	fillAlphaSettings(json.transformations.alpha);
	fillRotationSettings(json.transformations.rotation);
	fillPositionSettings([json.x, json.y]);
	fillOutlineSettings({
		"strokeStyle": json.shape.line.strokeStyle,
		"strokeColor": json.shape.color
	});
	//fillSizeSettings([json.shape.rect.w, json.shape.rect.h]);
}

function fillTextTabSettings(json) {
	fillScaleSettings(json.transformations.scale);
	fillAlphaSettings(json.transformations.alpha);
	fillRotationSettings(json.transformations.rotation);
	fillPositionSettings([json.x, json.y]);
	fillTextValueSettings(json.text.value);
	fillColorSettings(json.text.color);
	// fillTextColorSettings(json.text.color);
	//fillTextStylingSettings(json.text);
	//fillSizeSettings([json.shape.rect.w, json.shape.rect.h]);
}

function fillHalfCircleTabSettings(json) {
	fillScaleSettings(json.transformations.scaleX, json.transformations.scaleY);
	fillAlphaSettings(json.transformations.alpha);
	fillRotationSettings(json.transformations.rotation);
	fillFillSettings(json.shape.fill);
	fillOutlineSettings(json.shape.stroke);
	fillPositionSettings([json.x, json.y]);
	// fillRadiusSettings(json.shape.circle.radius);
	fillColorSettings(json.shape.color);
}

function fillGroupTabSettings(json) {
	fillScaleSettings(json.transformations.scaleX, json.transformations.scaleY);
	fillAlphaSettings(json.transformations.alpha);
	fillRotationSettings(json.transformations.rotation);
	fillPositionSettings([json.x, json.y]);
	//fillSizeSettings([json.shape.rect.w, json.shape.rect.h]);
}

function fillGeneralTabSettings(json) {

}

function fillScaleSettings(newXValue, newYValue) {
	$("#scaleXAmount").spinner("value", newXValue);
	$("#scaleYAmount").spinner("value", newYValue);
}

function fillRotationSettings(newValue) {
	$("#rotateSlider").slider("value", newValue);
	$("#rotateAmount").spinner("value", newValue);
}

function fillAlphaSettings(newValue) {
	$("#alphaSlider").slider("value", newValue);
	$("#alphaAmount").spinner("value", newValue);
}

function fillPositionSettings(newValue) {
	$("#xSettings").spinner("value", newValue[0]);
	$("#ySettings").spinner("value", newValue[1]);
}

function fillSizeSettings(newValue) {
	$("#wSettings").spinner("value", newValue[0]);
	$("#hSettings").spinner("value", newValue[1]);
}

function fillColorSettings(newValue) {
	$("#fillColorBox")
		.colpick({
			color: newValue
		})
		.css('background-color', newValue);
}

function fillTextColorSettings(newValue) {
	$("#fillTextColorBox")
		.colpick({
			color: newValue
		})
		.css('background-color', newValue);
}

function fillFillSettings(newValue) {
	$("#fillCheckSettings").prop("checked", newValue);
}

function fillOutlineSettings(newValue) {
	if (newValue) {
		$("#outlineStrokeSettings").val(newValue.strokeStyle);
		$("#outlineColorBox")
			.colpick({
				color: newValue.strokeColor
			})
			.css('background-color', newValue.strokeColor);
	}
}

function fillRadiusSettings(newValue) {
	$("#radiusSettings").spinner("value", newValue);
}

function fillSidesSettings(newValue) {
	$("#sideSettings").spinner("value", newValue);
}

function fillPointSizeSettings(newValue) {
	$("#pointSizeSettings").spinner("value", newValue);
}

function fillAngleSettings(newValue) {
	$("#angleSettings").spinner("value", newValue);
}

function fillTextValueSettings(newValue) {
	$("#textValue").html(newValue);
}

function initTransformationSettings() {

}

function initEdits() {
	scaleBoth = false;

	$("#linkScaling").click(function(evt) {
		$(this).toggleClass("checked");

		if ($(this).hasClass("checked")) {
			$(this).css("border-left", "1px solid gray");
			scaleBoth = true;
		} else {
			$(this).css("border-left", "0");
			scaleBoth = false;
		}
	});

	//TRANSFORMATION SETTINGS
	$("#scaleXAmount").spinner({
		icons: {
			down: "ui-icon-minus",
			up: "ui-icon-plus"
		},
		step: 0.1,
		start: 1,
		stop: function(event, ui) {
			if (scaleBoth) {
				changeScaleY(this.value);
				$("#scaleYSlider").slider("value", this.value);
			}
			changeScaleX(this.value);
			$("#scaleXSlider").slider("value", this.value);
			updateElement(STATE.selectedElement.parent);
		},
		// change: function(event, ui) {
		// 	if (scaleBoth) {
		// 		changeScaleY(this.value);
		// 		$("#scaleYSlider").slider("value", this.value);
		// 	}
		// 	changeScaleX(this.value);
		// 	$("#scaleXSlider").slider("value", this.value);
		// }
	});

	$("#scaleXSlider").slider({
		orientation: "horizontal",
		min: -10,
		max: +10,
		value: 0,
		step: 0.1,
		slide: function(event, ui) {
			var value = ui.value.toString();
			if (scaleBoth) {
				changeScaleY(value);
				$("#scaleYAmount").spinner("value", value);
			}
			$("#scaleXAmount").spinner("value", value);
			changeScaleX(value);
			updateElement(STATE.selectedElement.parent);
		}
	});

	$("#scaleYAmount").spinner({
		icons: {
			down: "ui-icon-minus",
			up: "ui-icon-plus"
		},
		step: 0.1,
		start: 1,
		stop: function(event, ui) {
			if (scaleBoth) {
				changeScaleX(this.value);
				$("#scaleXSlider").slider("value", this.value);
			}
			changeScaleY(this.value);
			$("#scaleYSlider").slider("value", this.value);
			updateElement(STATE.selectedElement.parent);
		},
		// change: function(event, ui) {
		// 	if (scaleBoth) {
		// 		changeScaleX(this.value);
		// 		$("#scaleXSlider").slider("value", this.value);
		// 	}
		// 	changeScaleY(this.value);
		// 	$("#scaleYSlider").slider("value", this.value);
		// }
	});

	$("#scaleYSlider").slider({
		orientation: "horizontal",
		min: -10,
		max: +10,
		value: 0,
		step: 0.1,
		slide: function(event, ui) {
			var value = ui.value.toString();
			if (scaleBoth) {
				$("#scaleXAmount").spinner("value", value);
				changeScaleX(value);
			}
			$("#scaleYAmount").spinner("value", value);
			changeScaleY(value);
			updateElement(STATE.selectedElement.parent);
		}
	});



	//ROTATION
	$("#rotateAmount").spinner({
		icons: {
			down: "ui-icon-minus",
			up: "ui-icon-plus"
		},
		step: 1,
		start: 0,
		max: 360,
		min: 0,
		stop: function(event, ui) {
			$("#rotateSlider").slider("value", this.value);
			changeRotationSettings(this.value);
			updateElement(STATE.selectedElement.parent);
		},
	});

	$("#rotateSlider").slider({
		orientation: "horizontal",
		min: 0,
		max: 360,
		value: 0,
		slide: function(event, ui) {
			var value = ui.value.toString();
			$("#rotateAmount").spinner("value", value);
			changeRotationSettings(value);
			updateElement(STATE.selectedElement.parent);
		}
	});

	//ALPHA
	$("#alphaAmount").spinner({
		icons: {
			down: "ui-icon-minus",
			up: "ui-icon-plus"
		},
		step: 0.05,
		start: 1,
		max: 1,
		min: 0,
		stop: function(event, ui) {
			$("#alphaSlider").slider("value", this.value);
			changeAlphaSettings(this.value);
			updateElement(STATE.selectedElement.parent);
		},
		// change: function(event, ui) {
		// 	$("#alphaSlider").slider("value", this.value);
		// 	changeAlphaSettings(this.value);
		// }
	});

	$("#alphaSlider").slider({
		//orientation: "vertical",
		min: 0,
		max: 1,
		value: 1,
		step: 0.1,
		slide: function(event, ui) {
			var value = ui.value.toString();
			$("#alphaAmount").spinner("value", value);
			changeAlphaSettings(value);
			updateElement(STATE.selectedElement.parent);
		}
	});

	//POSITION SETTINGS
	$("#xSettings").spinner({
		icons: {
			down: "ui-icon-minus",
			up: "ui-icon-plus"
		},
		stop: function(event, ui) {
			changeXSettings(this.value);
			updateElement(STATE.selectedElement.parent);
		},
	});

	$("#ySettings").spinner({
		icons: {
			down: "ui-icon-minus",
			up: "ui-icon-plus"
		},
		stop: function(event, ui) {
			console.log("spin");
			changeYSettings(this.value);
			updateElement(STATE.selectedElement.parent);
		},
		// change: function(event, ui) {
		// 	if (STATE.selectedElement) {
		// 		changeYSettings(this.value);
		// 		updateElement(STATE.selectedElement.parent);
		// 		console.log("CHANGE!");
		// 	}
		// }
	});

	//FILL SETTINGS
	$("#fillCheckSettings").on('change', function(event) {
		if (STATE.selectedElement) {
			changeFillSettings(this.checked);
			updateElement(STATE.selectedElement.parent);
		}
	});

	$("#fillColorBox").colpick({
		submit: 0,
		color: STATE.color,
		onHide: function() {
			initColorClick("#fillColorBox");
		},
		onChange: function(hsb, hex, rgb, el, bySetColor) {
			$("#fillColorBox").css('background', '#' + hex);

			// Fill the text box just if the color was set using the picker, and not the colpickSetColor function.
			if (!bySetColor) $(el).val(hex);
			changeColorSettings('#' + hex);
			if (STATE.selectedElement) updateElement(STATE.selectedElement.parent);
		}
	})
		.css('background-color', STATE.color);

	//OUTLINE SETTINGS
	$("#outlineStrokeSettings").spinner({
		icons: {
			down: "ui-icon-minus",
			up: "ui-icon-plus"
		},
		stop: function(event, ui) {
			changeOutlineSettings(this.value);
			updateElement(STATE.selectedElement.parent);
		},
		// change: function(event, ui) {
		// 	changeOutlineSettings(this.value);
		// 	if (STATE.selectedElement) updateElement(STATE.selectedElement.parent);
		// }
	});

	$("#outlineColorBox").colpick({
		submit: 0,
		layout: 'rgbhex',
		color: STATE.color,
		onHide: function() {
			initColorClick("#outlineColorBox");
		},
		onChange: function(hsb, hex, rgb, el, bySetColor) {
			$("#outlineColorBox").css('background', '#' + hex);
			if (!bySetColor) $(el).val(hex);
			changeOutlineColorSettings('#' + hex);
			if (STATE.selectedElement) updateElement(STATE.selectedElement.parent);
		}
	})
		.css('background-color', STATE.color);

	//CIRCLE SETTINGS
	$("#radiusSettings").spinner({
		icons: {
			down: "ui-icon-minus",
			up: "ui-icon-plus"
		},
		stop: function(event, ui) {
			changeRadiusSettings(this.value);
			if (STATE.selectedElement) updateElement(STATE.selectedElement.parent);
		},
		// change: function(event, ui) {
		// 	changeRadiusSettings(this.value);
		// 	if (STATE.selectedElement) updateElement(STATE.selectedElement.parent);
		// }
	});

	//rect Settings
	$("#wSettings").spinner({
		icons: {
			down: "ui-icon-minus",
			up: "ui-icon-plus"
		},
		stop: function(event, ui) {
			changeWSettings(this.value);
			if (STATE.selectedElement) updateElement(STATE.selectedElement.parent);
		},
		// change: function(event, ui) {
		// 	changeWSettings(this.value);

		// }
	});

	$("#hSettings").spinner({
		icons: {
			down: "ui-icon-minus",
			up: "ui-icon-plus"
		},
		stop: function(event, ui) {
			changeHSettings(this.value);
			if (STATE.selectedElement) updateElement(STATE.selectedElement.parent);
		},
		// change: function(event, ui) {
		// 	changeHSettings(this.value);
		// 	if (STATE.selectedElement) updateElement(STATE.selectedElement.parent);
		// }
	});

	//POLYSTAR SETTINGS
	$("#sideSettings").spinner({
		icons: {
			down: "ui-icon-minus",
			up: "ui-icon-plus"
		},
		stop: function(event, ui) {
			changeSideSettings(this.value);
			if (STATE.selectedElement) updateElement(STATE.selectedElement.parent);
		},
		// change: function(event, ui) {
		// 	changeSideSettings(this.value);
		// 	if (STATE.selectedElement) updateElement(STATE.selectedElement.parent);
		// }
	});

	$("#pointSizeSettings").spinner({
		icons: {
			down: "ui-icon-minus",
			up: "ui-icon-plus"
		},
		min: 0,
		step: 0.1,
		stop: function(event, ui) {
			changePointSizeSettings(this.value);
			if (STATE.selectedElement) updateElement(STATE.selectedElement.parent);
		},
		// change: function(event, ui) {
		// 	changePointSizeSettings(this.value);
		// 	if (STATE.selectedElement) updateElement(STATE.selectedElement.parent);
		// }
	});

	$("#angleSettings").spinner({
		icons: {
			down: "ui-icon-minus",
			up: "ui-icon-plus"
		},
		stop: function(event, ui) {
			changeAngleSettings(this.value);
			if (STATE.selectedElement) updateElement(STATE.selectedElement.parent);
		},
		// change: function(event, ui) {
		// 	changeAngleSettings(this.value);
		// 	if (STATE.selectedElement) updateElement(STATE.selectedElement.parent);
		// }
	});

	$("#textValue")
		.on('input propertychange', function(event) {
			console.log("TextValue changed to " + $(this).val());
			STATE.selectedElement.parent.createjsShape.text = $(this).val();
			updateElement(STATE.selectedElement.parent);
		})
		.parent().css("width", "430px");

	$("input[name='font_style']").change(function(evt) {
		console.log("Font Style changed to " + this.id);
		if (STATE.selectedElement) {
			changeFontStyle(STATE.selectedElement.parent, this.id);
			updateElement(STATE.selectedElement.parent);
		}
	});

	$(".text_size").click(function(evt) {
		if (STATE.selectedElement) {
			changeFontSize(STATE.selectedElement.parent, this.id);
			updateElement(STATE.selectedElement.parent);
		}
	});

	$("input[name='text_style']").change(function(evt) {
		console.log(this.id + " was clicked and is now " + this.checked);
		if (STATE.selectedElement) {
			changeTextStyle(STATE.selectedElement.parent, this.id, this.checked);
			updateElement(STATE.selectedElement.parent);
		}
	});

	$("#oneForward").click(function(evt) {
		if (STATE.selectedElement) {
			oneForward(STATE.selectedElement.parent);
		}
	});

	$("#oneBackward").click(function(evt) {
		if (STATE.selectedElement) {
			oneBackward(STATE.selectedElement.parent);
		}
	});

	$("#toFront").click(function(evt) {
		if (STATE.selectedElement) {
			toFront(STATE.selectedElement.parent);
		}
	});


	$("#toBack").click(function(evt) {
		if (STATE.selectedElement) {
			toBack(STATE.selectedElement.parent);
		}
	});

	function initColorClick(identifier) {
		console.log("submit");
		$(".colorbox").append('<div class="color" style="background-color:' + $(identifier).css("background-color") + ' "> </div>');

		$(".color").click(function() {
			if (STATE.selectedElement) {
				var prop = STATE.selectedElement.parent.getElementProp();
				if (prop === "polystar" || prop == "circle" || prop === "rect" || prop === "line" || porp === "halfCircle" || prop === "text") {
					changeColorSettings($(this).css("background-color"));

					$(fillColorBox)
						.colpick({
							color: '#' + hex
						})
						.css('background-color', '#' + hex);
				}
			}
		});
	}

	function changeXSettings(newValue) {
		if (!STATE.selectedElement) {
			return;
		}
		console.log("Spinned x with " + this.value);
		if (typeof Number(newValue) != 'NaN') {
			STATE.selectedElement.parent.createjsShape.x = newValue;
			STATE.selectedElement.container.x = newValue;
		} else {
			alert("please enter only numeric values");
		}
	}

	function changeYSettings(newValue) {
		if (!STATE.selectedElement) {
			return;
		}
		if (typeof Number(newValue) != 'NaN') {
			STATE.selectedElement.parent.createjsShape.y = newValue;
			STATE.selectedElement.container.y = newValue;
		} else {
			alert("please enter only numeric values");
		}
	}

	function changeScaleX(newValue) {
		if (STATE.selectedElement) {
			var elem = STATE.selectedElement;
			if (elem.mask) {
				elem.mask.scaleX = newValue;
			} else if (elem.parent.getElementProp() == "text") {
				elem.parent.hitArea.graphics.clear();
				telem.parent.hitArea.graphics.beginFill("#000").drawRect(0, 0, elem.parent.getMeasuredWidth(), elem.parent.getMeasuredHeight());
			}
			elem.parent.createjsShape.scaleX = newValue;
		}
	}

	function changeScaleY(newValue) {
		if (STATE.selectedElement) {
			var elem = STATE.selectedElement;
			if (elem.mask) {
				elem.mask.scaleY = newValue;
			} else if (elem.parent.getElementProp() == "text") {
				elem.parent.hitArea.graphics.clear();
				telem.parent.hitArea.graphics.beginFill("#000").drawRect(0, 0, elem.parent.getMeasuredWidth(), elem.parent.getMeasuredHeight());
			}
			elem.parent.createjsShape.scaleY = newValue;
		}
	}

	function changeRotationSettings(newValue) {
		if (STATE.selectedElement) {
			if (STATE.selectedElement.parent.mask) {
				STATE.selectedElement.parent.mask.rotation = newValue;
			}
			STATE.selectedElement.parent.createjsShape.rotation = newValue;
			STATE.selectedElement.container.rotation = newValue;
		}
	}

	function changeAlphaSettings(newValue) {
		if (STATE.selectedElement) {
			STATE.selectedElement.parent.createjsShape.alpha = newValue;
		}
	}

	function changeFillSettings(newValue) {
		if (STATE.selectedElement) {
			console.log("fill Changed: checked " + newValue);
			STATE.selectedElement.parent.fill = newValue;
			STATE.selectedElement.parent.redrawGraphic();
		}
	}

	function changeColorSettings(newValue) {
		if (STATE.selectedElement) {
			var element = STATE.selectedElement.parent;
			if (element.getElementProp() == "text") {
				element.createjsShape.color = newValue;
			} else {
				element.color = newValue;
				element.redrawGraphic();
			}
		}
	}

	function changeOutlineSettings(newValue) {
		if (STATE.selectedElement) {
			if (newValue === 0) {
				STATE.selectedElement.parent.stroke = false;
			} else {
				STATE.selectedElement.parent.stroke = true;
			}

			STATE.selectedElement.parent.strokeStyle = newValue;
			STATE.selectedElement.parent.redrawGraphic();
		}
	}

	function changeOutlineColorSettings(newValue) {
		if (STATE.selectedElement) {
			var element = STATE.selectedElement.parent;
			if (element.getElementProp() == "line") {
				element.color = newValue;
			}
			element.strokeColor = newValue;
			element.redrawGraphic();
		}
	}

	function changeRadiusSettings(newValue) {
		if (STATE.selectedElement) {
			if (STATE.selectedElement.parent.mask) {
				STATE.selectedElement.parent.mask.radius = newValue;
			}
			STATE.selectedElement.parent.radius = newValue;
			STATE.selectedElement.parent.redrawGraphic();
		}
	}

	function changeWSettings(newValue) {
		if (STATE.selectedElement) {
			STATE.selectedElement.parent.w = newValue;
			STATE.selectedElement.parent.redrawGraphic();
		}
	}

	function changeHSettings(newValue) {
		if (STATE.selectedElement) {
			STATE.selectedElement.parent.h = newValue;
			STATE.selectedElement.parent.redrawGraphic();
		}
	}

	function changeSideSettings(newValue) {
		if (STATE.selectedElement) {
			STATE.selectedElement.parent.sides = newValue;
			STATE.selectedElement.parent.redrawGraphic();
		}
	}

	function changePointSizeSettings(newValue) {
		if (STATE.selectedElement) {
			STATE.selectedElement.parent.pointSize = newValue;
			STATE.selectedElement.parent.redrawGraphic();
		}
	}

	function changeAngleSettings(newValue) {
		if (STATE.selectedElement) {
			STATE.selectedElement.parent.angle = newValue;
			STATE.selectedElement.parent.redrawGraphic();
		}
	}

	function toFront(element) {
		element.layer.changeElementIndex(element.id, element.layer.elements['ids'].length - 1);
		updateElementIndex(STATE.selectedElement.parent, "toFront", -1);

		var htmlElement = $("#element_" + element.id);
		$("#element_" + element.id).detach();
		$("#layer_" + element.layer.id).children(":first").after(htmlElement);
	}

	function toBack(element) {
		console.log("ids are " + element.layer.elements['ids']);
		element.layer.changeElementIndex(element.id, 0);
		updateElementIndex(STATE.selectedElement.parent, "toBack", -1);

		var htmlElement = $("#element_" + element.id);
		$("#element_" + element.id).detach();
		$("#layer_" + element.layer.id).append(htmlElement);
	}

	function oneForward(element) {
		if (element.getIndex() + 1 > element.layer.elements['ids'].length - 1) {
			return;
		}

		element.layer.changeElementIndex(element.id, element.getIndex() + 1);

		updateElementIndex(STATE.selectedElement.parent, "oneForward", -1);

		var index = $("#layer_" + element.layer.id).children().index($("#element_" + element.id));
		$("#element_" + element.id)
			.detach()
			.insertBefore($("#layer_" + element.layer.id).children().get(index - 1));
	}

	function oneBackward(element) {
		console.log("in one backward with index " + element.getIndex());
		if (element.getIndex() - 1 < 0) {
			return;
		}
		element.layer.changeElementIndex(element.id, element.getIndex() - 1);

		updateElementIndex(STATE.selectedElement.parent, "oneBackward", -1);

		console.log("elementindex is now " + element.getIndex());

		var index = $("#layer_" + element.layer.id).children().index($("#element_" + element.id));
		$("#element_" + element.id)
			.detach()
			.insertAfter($("#layer_" + element.layer.id).children().get(index));
	}

	function changeFontStyle(element, style) {
		if (style == "font_sans") {
			element.fontStyle = "Arial, sans-serif";
		} else if (style == "font_script") {
			element.fontStyle = "Bradley Hand ITC, cursive";
		} else if (style == "font_serif") {
			element.fontStyle = "Georgia, serif";
		}
		element.redrawGraphic();
	}

	function changeFontSize(element, size) {
		if (size == "text_minus") {
			element.fontSize -= 2;
		} else if (size == "text_plus") {
			element.fontSize += 2;
		}
		element.redrawGraphic();
	}

	function changeTextStyle(element, style, checked) {
		if (style == "text_bold") {
			element.bold = checked;
		} else if (style == "text_italic") {
			element.italic = checked;
		}
		element.redrawGraphic();
	}


}