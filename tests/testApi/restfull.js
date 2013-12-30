var http = require('http'),
    winston = require('winston');
var journey = require('journey');

//
// Create a Router
//
var router = new(journey.Router);

router.map(function() {
    this.root.bind(function (req, res) { res.send("Welcome") });
    //
    // LIST: GET to /api/categories lists all api categories
    //
    this.get("/api/categories").bind(function(req,res,id) {
        var result = [
            { id: 1, name: "category name 1" },
            { id: 2, name: "category name 2" },
            { id: 3, name: "category name 3" },
            { id: 4, name: "category name 4" },
            { id: 5, name: "category name 5" },
            { id: 6, name: "category name 6" }

        ];
        res.send(200, { 'Content-Type': 'application/json' }, result);
    });

    //
    // SHOW: GET to /api/apilist/:id list all api list
    //
    this.get("/api/apilist").bind(function(req, res, id) {
        var result = [
            { id: 1, name: "api name 1" },
            { id: 2, name: "api name 2" },
            { id: 3, name: "api name 3" },
            { id: 4, name: "api name 4" },
            { id: 5, name: "api name 5" },
            { id: 6, name: "api name 6" },
            { id: 7, name: "api name 7" },
            { id: 8, name: "api name 8" }

        ];
        res.send(200, {}, result);
    });

    //
    // CREATE: POST to /bookmarks creates a new bookmark
    //
    this.post().bind(function(res, bookmark) {
        res.send(501, {}, {
            action: 'create'
        });
    });

    //
    // UPDATE: PUT to /bookmarks updates an existing bookmark
    //
    this.put(/\/([\w|\d|\-|\_]+)/).bind(function(res, bookmark) {
        res.send(501, {}, {
            action: 'update'
        });
    });

    //
    // DELETE: DELETE to /bookmarks/:id deletes a specific bookmark
    //
    this.del(/\/([\w|\d|\-|\_]+)/).bind(function(res, id) {
        res.send(501, { }, {
            action: 'delete'
        });
    });
});
/**
 * Creates the server for the pinpoint web service
 * @param {int} port: Port for the server to run on
 */
exports.createServer = function(port) {
    var server = http.createServer(function(request, response) {
        winston.info('Incoming Request', {
            url: request.url
        });
        var body = '';
        request.on('data', function(chunk) {
            body += chunk;
        });
        request.on('end', function() {
            router.handle(request, body, function(result) {
                var header = result.headers;
                header['Access-Control-Allow-Origin']= '*';
                header['Access-Control-Allow-Methods']= "*";//GET, PUT, POST, DELETE, OPTIONS
                header['Access-Control-Allow-Headers']= '*';//Content-Type, Authorization, X-Requested-With

                response.writeHead(result.status, header);

                response.end(result.body);
            });
        });
        // response.writeHead(200, { 'Content-Type': 'application/json' });
        // response.end(JSON.stringify({ message: 'not implemented' }));
    });

    if (port) {
        winston.info("listen port: localhost:" + port);
        server.listen(port);
    }

    return server;
};