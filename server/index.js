var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");

var handle = {};
handle["/"] = requestHandlers.startHtml;
handle["/start"] = requestHandlers.start;
handle["/show"] = requestHandlers.show;
handle["/startHtml"] = requestHandlers.startHtml;

/*events*/
handle["/load"] = requestHandlers.load;
handle["/save"] = requestHandlers.save;
handle["/getDefaultShape"] = requestHandlers.getDefaultShape;
handle["/getDefaultImage"] = requestHandlers.getDefaultImage;
handle["/update"] = requestHandlers.update;
handle["/add"] = requestHandlers.add;
handle["/remove"] = requestHandlers.remove;
handle["/changeDefaultSettings"] = requestHandlers.changeDefaultSettings;
handle["/getDefaultSettings"] = requestHandlers.getDefaultSettings;
handle["/setSession"] = requestHandlers.setSession;
handle["/getSessions"] = requestHandlers.getSessions;
handle["/getFoldlerContent"] = requestHandlers.getFoldlerContent;
handle["/newCustomShape"] = requestHandlers.newCustomShape;
handle["/getCustomShape"] = requestHandlers.getCustomShape;
handle["/uploadFile"] = requestHandlers.uploadFile;


/*resources*/
handle["/loadResource"] = requestHandlers.loadResource;
handle["/output.html"]


server.start(router.route, handle);
