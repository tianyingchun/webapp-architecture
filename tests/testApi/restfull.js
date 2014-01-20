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
        { _id: 1, key: "payment",isDisplay:true, expanded:true, name: "平安支付API", apis:[
            {_id: 2, key: "binding_oauth2", name: "平安付绑定(oauth2)", apis:null },
            {_id: 3, key: "access_token", name: "换取access_token", apis:null },
            {_id: 4, key: "bravo-c", name: "bravo-c", apis:null },
            {_id: 5, key: "bravo-d", name: "bravo-d", apis:null },
            {_id: 6, key: "bravo-e", name: "bravo-e", apis:null },
            {_id: 7, key: "bravo-f", name: "bravo-f", apis:null }
        ]},
        { _id: 8, key:"delta", isDisplay:true, name: "category name 2",apis: [
            {_id: 9, key: "delta-a", name: "delta-a", apis:null },
            {_id: 10, key: "delta-b", name: "delta-b", apis:null },
            {_id: 11, key: "delta-c", name: "delta-c", apis:null },
            {_id: 12, key: "delta-d", name: "delta-d", apis:null }
        ]},
        { _id: 13, key:"epsilon", isDisplay:true, expanded:true, name: "category name 3", apis:[
            {_id: 14, key: "epsilon-a", name: "epsilon-a", apis:null },
            {_id: 15, key: "epsilon-b", name: "epsilon-b", apis:null },
            {_id: 16, key: "epsilon-c", name: "epsilon-c", apis:null },
            {_id: 17, key: "epsilon-d", name: "epsilon-d", apis:null },
            {_id: 18, key: "epsilon-e", name: "epsilon-e", apis:null }
        ]},
        { _id: 19, key:"charlie", isDisplay:false, name: "category name 4" },
        { _id: 20, key:"detage", isDisplay:true, name: "category name 5" }

    ];
  
    /**
     * Get category detail information
     * /^\/api\/category\/([0-9]+)$/  ->/api/category/1
     */
    this.get("/category").bind(function(req, res, data) {
        winston.info("category: ", data);
        var categoryKey = data.key;
        var result = {};
        for (var i = 0; i < soruceData.length; i++) {
            var item = soruceData[i];
            // console.log(item.key, categoryKey);
            if (item.key == categoryKey) {
                result = item;
                break;
            }
        };
        result.details = {
            // api functional descriptions.
            description: "使用原生的REST API，可以使您更加自由地开发出灵活的功能.<br /><ul>"
                        +"<li><span>name01</span></li>"
                        +"<li><span>name02</span></li>"
                        +"<li><span>name03</span></li>"
                        +"</ul>",
            // request body and parameters and headers.
            request: {
                body: "PUT /BucketName?sign=MBO:aCLCZtoFQg8I:WQMFNZEhN2k8xxlgikuPfCJMuE8%3D <br />HTTP/1.1 Host: bcs.duapp.com <br />Content-Length:0 ",
                payload:"{name:'tianyingchun', password:'xxxx', code:'bearer xhse$$#'}",// json string
                params: [
                    {name:"x-bs-acl1",  value:"[public-read|public-write|public-read-write", isRequired: true, description: "设置bucket的权限，复杂的权限控制可以参考acl设置"},
                    {name:"testssssss",  value:"value2", isRequired: true, description: "desc2",more:"<b>oh my god....</b>"},
                    {name:"name3",  value:"value3", isRequired: true, description: "desc3",more:""}
                ],
                // headers.
                headers:[
                    {name:"x-bs-acl1", value:"[public-read|public-write|public-read-write", isRequired: true, description: "设置bucket的权限，复杂的权限控制可以参考acl设置"},
                    {name:"name2", value:"value2", isRequired: true, description: "desc2"}
                ]
            },
            // response body and headers.
            response: {
                body: '{"bucket_name":"test","status":"0", "cdatetime":"1371765410", "used_capacity":"21148", "total_capacity":"0", "region":"beijing"}',
                params: [
                    {name:"name1", value:"value1", isRequired: true, description: "desc1",more:""},
                    {name:"name2",  value:"value2", isRequired: true,description: "desc2",more:""},
                    {name:"name3",  value:"value3", isRequired: true, description: "desc3",more:""}
                ],
                Headers:"HTTP/1.1 200 OK <br />Date: Sat, 01 Jan 2011 00:00:00 GMT </br>Server: BaiduBS"
            },
            // rest api request, response sample
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
            },
            // sdk code samples
            sdk: {
                "java": "private String username;",
                "javascript": "var result = { name: 'useranme', passwrod:'password'};",
                "cs": "using System;public class Program {}"
            },
            // question and answers
            questions: [
                {question: "为什么这个接口老抛出500内部错误！", answer: "请注意在发起调用请求的时候需要带上Header,</br > 同时需要确保请求METHOD 为POST"},
                {question: "为什么这个接口老抛出500内部错误！", answer: "请注意在发起调用请求的时候需要带上Header, 同时需要确保请求METHOD 为POST"}
            ]
        };
        if (categoryKey == "binding_oauth2") {
            result.details = {
                description: "0.1.1 换取access_token接口错误信息更改",
                request: {
                    body: "GET https://test-www.1qianbao.com/pinganfuweb/auth",
                    params: [
                        {name:"response_type",  value:"code", isRequired: true, description: "返回token类型,用于调用换取access_token的接口",more:""},
                        {name:"client_id",  value:"API ID", isRequired: true, description: "此为API ID",more:""},
                        {name:"redirect_uri",  value:"", isRequired: true, description: "返回URI(当用户授权后，会跳转回去这个URI）",more:""},
                        {name:"scope",  value:"user|user:balance", isRequired: true, description: "授权的类型,user:用户基本信息,user:balance:用户可用余额",more:""},
                        {name:"state",  value:"", isRequired: false, description: "此字段会被返回到返回URI(绑定后）",more:""},
                        {name:"constraints", value:"", isRequired: false, description: "JSON 字符串, 定义用户约束，可用字段为mobile,name,idNumber,<br />mobile -绑定用户必须是用此手机号<br />name - 绑定用户的名字必须一样<br />idNumber - 绑定用户的证件号必须一致",more:""}
                    ],
                    // headers.
                    headers:[
                       
                    ]
                },
                // response body and headers.
                response: {
                    body: '{"code":"......","state":"0"} ',
                    params: [
                        {name:"code",  value:"",isRequired: true, description: "用于调用换取access_token的接口 ",more:""},
                        {name:"state",  value:"",isRequired: true, description: "此字段会被返回到返回URI(绑定后）",more:""}
                    ],
                    Headers:""
                },
                examples:{
                    postCommand: '暂时未提供。。',
                    request:"暂时未提供。。",
                    response: "暂时未提供。。"
                },
                // sdk code samples
                sdk: {
                    "java": "暂时未提供。。",
                    "javascript": "暂时未提供。。",
                    "cs": "暂时未提供。。"
                },
                // question and answers
                questions: [
                    {question: "暂时未提供。。", answer: "暂时未提供。。"}
                ]
            }    
        }
        if (categoryKey == "access_token") {
            result.details = {
                description: "换取access_token接口,返回的是JSON类型",
                request: {
                    body: "POST https://test-www.1qianbao.com/pinganfuweb/token",
                    params: [
                        {name:"code",  value:"code", isRequired: true, description: "上述/auth接口(平安付绑定(oauth2))返回值",more:""},
                        {name:"client_id",  value:"API ID", isRequired: true, description: "此为API ID",more:""},
                        {name:"client_secret",  value:"", isRequired: true, description: "此为 API SECRET",more:""},
                        {name:"grant_type",  value:"", isRequired: true, description: "此为grant类型，现只可以是'bearer'",more:""}
                    ],
                    // headers.
                    headers:[
                        {name:"Authorization",  value:"[api_id] [api_secret]", isRequired: true, description: "必须把HTTP HEADER里的Authorization填上"}
                    ]
                },
                // response body and headers.
                response: {
                    body: '应该提供DEMO JSON 字符串模型',
                    params: [
                        {name:"expires_in",  value:"应该提供JSON 对应节点",isRequired: true, description: "token的有效期",more:""},
                        {name:"token_type",  value:"应该提供JSON 对应节点",isRequired: true, description: "现在只会是Bearer",more:""},
                        {name:"id_token",  value:"应该提供JSON 对应节点", isRequired: true, description: "暂为空",more:""}
                    ],
                    Headers:""
                },
                examples:{
                    postCommand: '暂时未提供。。',
                    request:"暂时未提供。。",
                    response: "暂时未提供。。"
                },
                // sdk code samples
                sdk: {
                    "java": "暂时未提供。。",
                    "javascript": "暂时未提供。。",
                    "cs": "暂时未提供。。"
                },
                // question and answers
                questions: [
                    {question: "暂时未提供。。", answer: "暂时未提供。。"}
                ]
            }   
        }
        setTimeout(function () {
            res.send(200, { 'Content-Type': 'application/json' }, result);
        },500);
    });
    //
    // LIST: GET to /api/categories lists all api categories
    //
    this.get("/categories").bind(function(req,res) {
        var result = soruceData;
        setTimeout(function () {
            res.send(200, { 'Content-Type': 'application/json' }, result);
        },500);
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
    this.get("/api/list").bind(function(req, res, id) {
        var result = [
            {id: 1, key: "bravo-a", name: "bravo-a" },
            {id: 2, key: "bravo-a", name: "bravo-a" },
            {id: 3, key: "bravo-b", name: "bravo-b" },
            {id: 4, key: "bravo-c", name: "bravo-c" },
            {id: 5, key: "bravo-d", name: "bravo-d" },
            {id: 6, key: "bravo-e", name: "bravo-e" },
            {id: 7, key: "bravo-f", name: "bravo-f" }
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