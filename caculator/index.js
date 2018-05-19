var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");

var handle = {};
handle["/"] = requestHandlers.index;
handle["/index"] = requestHandlers.index;
handle["/count"] = requestHandlers.count;
handle["/result"] = requestHandlers.result;
handle["/last_result"] = requestHandlers.last_result;

server.start(router.route, handle);
console.log("server start...")