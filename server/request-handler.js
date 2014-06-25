/* You should implement your request handler function in this file.
 * And hey! This is already getting passed to http.createServer()
 * in basic-server.js. But it won't work as is.
 * You'll have to figure out a way to export this function from
 * this file and include it in basic-server.js so that it actually works.
 * *Hint* Check out the node module documentation at http://nodejs.org/api/modules.html. */

var array = [];
array.push({
  username: 'testName1',
  text: 'testText1',
  roomname: 'testRoom1',
});
array.push({
  username: 'testName2',
  text: 'testText2',
  roomname: 'testRoom2',
});
array.push({
  username: 'testName3',
  text: 'testText3',
  roomname: 'testRoom3',
});

exports.handleRequest = function(request, response) {
  var handler = {};
  var statusCode = 200;
  var data = {results: null};

  // parse and process the requests
  handler.POST = function(request, response){
    statusCode = 201;
    request.on('data', function(data){
      array.push(JSON.parse(data));
    });
  };

  handler.GET = function(request, response){
    if (request.url.match(/classes/)) {
      statusCode = 200;
      // data = {'results': array };
      data = {results: array};
    } else {
      statusCode = 404;
    }
  };

  handler.OPTIONS = function(request, response) {
    statusCode= 200;
  };

  /* the 'request' argument comes from nodes http module. It includes info about the
  request - such as what URL the browser is requesting. */

  /* Documentation for both request and response can be found at
   * http://nodemanual.org/0.8.14/nodejs_ref_guide/http.html */

  console.log("Serving request type " + request.method + " for url " + request.url);

  if(handler.hasOwnProperty(request.method)){
    handler[request.method](request,response);
  }
  /* Without this line, this server wouldn't work. See the note
   * below about CORS. */
  var headers = defaultCorsHeaders;

  headers['Content-Type'] = "application/json";

  /* .writeHead() tells our server what HTTP status code to send back */
  response.writeHead(statusCode, headers);

  /* Make sure to always call response.end() - Node will not send
   * anything back to the client until you do. The string you pass to
   * response.end() will be the body of the response - i.e. what shows
   * up in the browser.*/

  response.end(JSON.stringify(data));
};

/* These headers will allow Cross-Origin Resource Sharing (CORS).
 * This CRUCIAL code allows this server to talk to websites that
 * are on different domains. (Your chat client is running from a url
 * like file://your/chat/client/index.html, which is considered a
 * different domain.) */
var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};
