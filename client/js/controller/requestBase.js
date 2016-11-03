var done = 4,
    ok = 200;

var setSessionPath = "/setSession";
var savePath = "/save";
var loadPath = "/load";
var updatePath = "/update";
var addPath = "/add";
var removePath = "/remove";
var getSessionsPath = "/getSessions";
var getDefaultShapePath = "/getDefaultShape";
var getDefaultImagePath = "/getDefaultImage";
var getDefaultSettingsPath = "/getDefaultSettings";
var getDefaultColorPath = "/getDefaultColor";
var changeDefaultSettingsPath = "/changeDefaultSettings";
var getFoldlerContentPath = "/getFoldlerContent";
var newCustomShapePath = "/newCustomShape";
var getCustomShapePath = "/getCustomShape";
var uploadFilePath = "/uploadFile";

function makeHttpObject() {
    try {
        return new XMLHttpRequest();
    } catch (error) {}
    try {
        return new ActiveXObject("Msxml2.XMLHTTP");
    } catch (error) {}
    try {
        return new ActiveXObject("Microsoft.XMLHTTP");
    } catch (error) {}

    throw new Error("Could not create HTTP request object.");
}

//GET request, for when the Client needs data from the server
function getRequest(path, callback, noEval) {
    var request = makeHttpObject();

    request.open("GET", path, true);
    request.onreadystatechange = function() {
        if (request.readyState === done && request.status === ok) {
            callback(eval("(" + request.responseText + ")"));
            //return eval("("+request.responseText+")"); 
        }
    };
    request.send();
}

//POST request for when the client wats to set data on the server or client II
function postRequest(path, jsondata, callback) {
    var request = makeHttpObject();
    request.open("POST", path, true);
    request.onreadystatechange = function() {
        if (request.readyState === done && request.status === ok) {
            console.log(request.responseText);
            if (callback) {
                callback();
            }
        }
    };
    request.send(JSON.stringify(jsondata));
}

function postGetRequest(path, jsondata, callback) {
    var request = makeHttpObject();
    request.open("POST", path, true);
    request.onreadystatechange = function() {
        if (request.readyState === done && request.status === ok) {
            var jsonResponse = eval("(" + request.responseText + ")");
            callback(jsonResponse);
        }
    };
    request.send(jsondata);
}

/*

function newDocRequest(storagePlace){
	var request = makeHttpObject();
	request.open("POST","/setSession",true);
	request.onreadystatechange = function () {
	    if (request.readyState == done && request.status == ok) {
	    	console.log(request.responseText);
	    }
	};
	request.send(storagePlace);
}

function saveRequest(jsondata) {
	var request = makeHttpObject();
	request.open("POST","/save",true);
	request.onreadystatechange = function () {
	    if (request.readyState == done && request.status == ok) {
	    	console.log(request.responseText);
	    }
	};
	request.send(JSON.stringify(jsondata));
}

function loadRequest() {
	var request = makeHttpObject();
	
	request.open("GET","/load",true);
	request.onreadystatechange = function () {
	    if (request.readyState == done && request.status == ok) {
			return eval("("+request.responseText+")"); 
	    }
	};
	request.send();
}*/