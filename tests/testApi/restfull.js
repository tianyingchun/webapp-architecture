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
            // category item info.
            { id: 1, name: "category name 1" },
            { id: 2, name: "category name 2" },
            { id: 3, name: "category name 3" },
            { id: 4, name: "category name 4" },
            { id: 5, name: "category name 5" },
            { id: 6, name: "category name 6" }

        ];
        res.send(200, { 'Content-Type': 'application/json' }, result);
    });

    /**
     * Get category detail information
     */
    this.get("/^\/api\/category\/([0-9]+)$/").bind(function(req, res, id) {
        winston.info("categoryId: ", id)
        var result = {
            id: id,
            name: "category name",
            details: {
                detail1: "detail",
                detail2: "detail2"
            }
        }
        res.send(200, { 'Content-Type': 'application/json' }, result);
    });

    //
    // SHOW: GET to /api/apilist/:id list all api list
    //
    this.get("/api/apilist").bind(function(req, res, id) {
        var result = [
            { apiId: 1, apiName: "api name 1" ,apiDesc: "api description"},
            { apiId: 2, apiName: "api name 2" ,apiDesc: "api description"},
            { apiId: 3, apiName: "api name 3" ,apiDesc: "api description"},
            { apiId: 4, apiName: "api name 4" ,apiDesc: "api description"},
            { apiId: 5, apiName: "api name 5" ,apiDesc: "api description"},
            { apiId: 6, apiName: "api name 6" ,apiDesc: "api description"},
            { apiId: 7, apiName: "api name 7" ,apiDesc: "api description"},
            { apiId: 8, apiName: "api name 8" ,apiDesc: "api description"}

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