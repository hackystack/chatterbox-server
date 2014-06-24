/* You should implement your request handler function in this file.
 * And hey! This is already getting passed to http.createServer()
 * in basic-server.js. But it won't work as is.
 * You'll have to figure out a way to export this function from
 * this file and include it in basic-server.js so that it actually works.
 * *Hint* Check out the node module documentation at http://nodejs.org/api/modules.html. */

var dataStore = [
{
  'username': 'testUser1',
  'text': 'testText1',
  'roomname': 'testRoom1'
},
{
  'username': 'testUser2',
  'text': 'testText2',
  'roomname': 'testRoom2'
},
{
  'username': 'testUser3',
  'text': 'testText3',
  'roomname': 'testRoom3'
}
];

module.exports.handleRequest = function(request, response) {
  var responseBody = "It's working!!!";

  /* the 'request' argument comes from nodes http module. It includes info about the
  request - such as what URL the browser is requesting. */

  /* Documentation for both request and response can be found at
   * http://nodemanual.org/0.8.14/nodejs_ref_guide/http.html */

  // console.log("Serving request type " + request.method + " for url " + request.url);

  //sort and handle incoming requests
  var handler = {};
  handler.GET = function(request, response){
    // console.log(">>>>> GET request detected <<<<<");

    responseBody = JSON.stringify({
      results: dataStore
    });
  };
  handler.POST = function(request, response) {
    console.log(">>>>> POST request detected <<<<<");
    request.on('data', function(data){
      var jsonData = JSON.parse(data.toString());
      dataStore.push(jsonData);
    });
  };


  var statusCode = 200;

  /* Without this line, this server wouldn't work. See the note
   * below about CORS. */
  var headers = defaultCorsHeaders;
  headers['Content-Type'] = "application/json";

  // handle request and update state vars
  if (handler.hasOwnProperty(request.method)) {
    handler[request.method](request, response);
  }

  /* .writeHead() tells our server what HTTP status code to send back */
  response.writeHead(statusCode, headers);

  /* Make sure to always call response.end() - Node will not send
   * anything back to the client until you do. The string you pass to
   * response.end() will be the body of the response - i.e. what shows
   * up in the browser.*/
  response.end(responseBody);
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
