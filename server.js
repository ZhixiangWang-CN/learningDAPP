var http = require("http");
var url = require("url");

function start (route, handle) {
    function onRequest (request, response) {
        var pathname = url.parse(request.url).pathname;
        var arg = url.parse(request.url, true).query;
        
        if('add1' in arg && 'add2' in arg){
        	var postData = {'add1':arg['add1'],'add2':arg['add2']}
        }
        else{
        	var postData = "";
        }
        
        route(handle, pathname, response, postData);
    }
    http.createServer(onRequest).listen(8888);
}

exports.start = start;