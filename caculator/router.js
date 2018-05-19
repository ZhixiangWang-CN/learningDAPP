function route (handle, pathname, response, data) {
    if(typeof handle[pathname] === 'function'){
        handle[pathname](response, data);
        //根据pathname调用方法
        console.log("now route for " + pathname)
    }
    else{    //不存在
        response.writeHead(404, {"Content-Type": "text/plain"});
        response.write("404 Not found");
        response.end(); 
    }
}

exports.route = route;