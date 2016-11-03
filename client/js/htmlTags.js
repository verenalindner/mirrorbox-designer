var positionSettingsPath = "./html/positionSettings.html";
var fillSettingsPath = "./html/fillSettings.html";
var outlineSettingsPath = "./html/outlineSettings.html";
var circleSettingsPath = "./html/circleSettings.html";
var rectSettingsPath = "./html/rectSettings.html";
var polystarSettingsPath = "./html/polystarSettings.html";
var textSettingsPath = "./html/textSettings.html";
var transformationSettingsPath = "./html/transformationSettings.html";
var arrangementSettingsPath = "./html/arrangementSettings.html";


function initAllSettings() {
	var count = 0;
	$.get(positionSettingsPath, function(data) {
		positionSettings = data;
		count++;
		if (count === 9) assignSettings();
	});
	$.get(fillSettingsPath, function(data) {
		fillSettings = data;
		count++;
		if (count === 9) assignSettings();
	});
	$.get(outlineSettingsPath, function(data) {
		outlineSettings = data;
		count++;
		if (count === 9) assignSettings();
	});
	$.get(circleSettingsPath, function(data) {
		circleHtmlSettings = data;
		count++;
		if (count === 9) assignSettings();
	});
	$.get(rectSettingsPath, function(data) {
		rectHtmlSettings = data;
		count++;
		if (count === 9) assignSettings();
	});
	$.get(polystarSettingsPath, function(data) {
		polystarHtmlSettings = data;
		count++;
		if (count === 9) assignSettings();
	});
	$.get(textSettingsPath, function(data) {
		textHtmlSettings = data;
		count++;
		if (count === 9) assignSettings();
	});
	$.get(transformationSettingsPath, function(data) {
		transformationSettings = data;
		count++;
		if (count === 9) assignSettings();
	});
	$.get(arrangementSettingsPath, function(data) {
		arrangementSettings = data;
		count++;
		if (count === 9) assignSettings();
	});

}

function assignSettings() {

	var circleSettings = [
		positionSettings,
		fillSettings,
		outlineSettings,
		circleHtmlSettings,
		transformationSettings,
		// arrangementSettings
	];

	var rectSettings = [
		positionSettings,
		fillSettings,
		outlineSettings,
		rectHtmlSettings,
		transformationSettings,
		// arrangementSettings
	];

	var polystarSettings = [
		positionSettings,
		fillSettings,
		outlineSettings,
		polystarHtmlSettings,
		transformationSettings,
		// arrangementSettings
	];

	var imgSettings = [
		positionSettings,
		transformationSettings,
		arrangementSettings
	];

	var textSettings = [
		positionSettings,
		fillSettings,
		transformationSettings,
		// arrangementSettings,
		textHtmlSettings
	];

	var lineSettings = [
		positionSettings,
		//lineTicknessSettings
		outlineSettings,
		transformationSettings,
		// arrangementSettings,
	];

	var halfCircleSettings = [
		//positionSettings,
		fillSettings,
		outlineSettings,
		// circleHtmlSettings,
		transformationSettings,
		arrangementSettings
	];

	var groupSettings = [
		//positionSettings,
		transformationSettings,
		arrangementSettings
	];

	possibleSettings = {};
	possibleSettings["circle"] = circleSettings;
	possibleSettings["rect"] = rectSettings;
	possibleSettings["polystar"] = polystarSettings;
	possibleSettings["img"] = imgSettings;
	possibleSettings["text"] = textSettings;
	possibleSettings["line"] = lineSettings;
	possibleSettings["halfCircle"] = halfCircleSettings;
	possibleSettings["group"] = groupSettings;
}