var http = require('http'),
    winston = require('winston');
var journey = require('journey');

//
// Create a Router
//
var router = new(journey.Router);

router.map(function() {
    this.root.bind(function (req, res) { res.send("Welcome") });
    var soruceData = [
        // category item info.
        { id: 1, key: "bravo",isDisplay:true, expanded:true, name: "category name 1", childs:[
            {id: 2, key: "bravo-a", name: "bravo-a", childs:null },
            {id: 3, key: "bravo-b", name: "bravo-b", childs:null },
            {id: 4, key: "bravo-c", name: "bravo-c", childs:null },
            {id: 5, key: "bravo-d", name: "bravo-d", childs:null },
            {id: 6, key: "bravo-e", name: "bravo-e", childs:null },
            {id: 7, key: "bravo-f", name: "bravo-f", childs:null }
        ]},
        { id: 8, key:"delta", isDisplay:true, name: "category name 2",childs: [
            {id: 9, key: "delta-a", name: "delta-a", childs:null },
            {id: 10, key: "delta-b", name: "delta-b", childs:null },
            {id: 11, key: "delta-c", name: "delta-c", childs:null },
            {id: 12, key: "delta-d", name: "delta-d", childs:null }
        ]},
        { id: 13, key:"epsilon", isDisplay:true, expanded:true, name: "category name 3", childs:[
            {id: 14, key: "epsilon-a", name: "epsilon-a", childs:null },
            {id: 15, key: "epsilon-b", name: "epsilon-b", childs:null },
            {id: 16, key: "epsilon-c", name: "epsilon-c", childs:null },
            {id: 17, key: "epsilon-d", name: "epsilon-d", childs:null },
            {id: 18, key: "epsilon-e", name: "epsilon-e", childs:null }
        ]},
        { id: 19, key:"charlie", isDisplay:false, name: "category name 4" },
        { id: 20, key:"detage", isDisplay:true, name: "category name 5" }

    ];
    //
    // LIST: GET to /api/categories lists all api categories
    //
    this.get("/api/categories").bind(function(req,res) {
        var result = soruceData;
        setTimeout(function () {
            res.send(200, { 'Content-Type': 'application/json' }, result);
        },2000);
    });

    /**
     * Get category detail information
     * /^\/api\/category\/([0-9]+)$/  ->/api/category/1
     */
    this.get("/api/category").bind(function(req, res, data) {
        winston.info("category: ", data);
        var categoryKey = data.key;
        var result = {};
        for (var i = 0; i < soruceData.length; i++) {
            var item = soruceData[i];
            if (item.key == categoryKey) {
                winston.info("item,", item);

                result = item;
                break;
            }
        };
        result.details = {
            description: "",
            request: {
                body: "PUT /BucketName?sign=MBO:aCLCZtoFQg8I:WQMFNZEhN2k8xxlgikuPfCJMuE8%3D HTTP/1.1 Host: bcs.duapp.com Content-Length:0 ",
                headers:[ 
                    {name: "x-bs-acl", value: "abear MBO", required: true, description: "设置bucket的权限，复杂的权限控制可以参考acl设置"},
                    {name: "client-id", value: "gcc_client", required: true, description: "gcc client settup description"}
                ]
            },
            response: {
                body: "response result..."
            },
            examples: {
                postCommand: 'curl -v -X PUT "http://bcs.duapp.com/mybucket?sign=MBO:aCLCZtoFQg8I:WQMFNZEhN2k8xxlgikuPfCJMuE8%3D"',
                request:"PUT /mybucket?sign=MBO:aCLCZtoFQg8I:WQMFNZEhN2k8xxlgikuPfCJMuE8%3D HTTP/1.1"
                            +"ser-Agent: curl/7.19.7 (universal-apple-darwin10.0) libcurl/7.19.7 OpenSSL/0.9.8l zlib/1.2.3"
                            +"Host: bcs.duapp.com"
                            +"Accept: */*"
                            +"Content-Length: 0",
                response: "HTTP/1.1 200 OK "
                            +"Connection: close"
                            +"Content-Length: 0"
                            +"Date: Wed, 20 Apr 2011 07:29:17 GMT"
                            +"Server: BaiduBS"
            }
        };

        res.send(200, { 'Content-Type': 'application/json' }, result);
    });

    // Update category information
    this.post("/api/category").bind(function (req, res, data) {
        winston.info("update info: ", data);
        var result = {
            id: data && data.categoryId,
            name: "New category name",
            details: {
                detail1: "updated detail",
                detail2: "updated detail2"
            }
        };
        res.send(200, { 'Content-Type': 'application/json' }, result);
    });
    // Post category..
    this.put("/api/category").bind(function (req, res, data) {
        winston.info("update info: ", data);
        var result = {
            id: data && data.categoryId,
            name: "updated category name",
            details: {
                detail1: "updated detail",
                detail2: "updated detail2"
            }
        };
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