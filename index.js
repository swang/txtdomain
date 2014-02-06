// web.js
var express = require("express");
var app = express();

app.get('/', function(req, res) {
  res.header("content-type: text/xml");
  res.send("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<Response>\
    <Message>Hello, Mobile Monkey</Message>\
</Response>");
});

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log("Listening on " + port);
});
