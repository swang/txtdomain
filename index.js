var express = require('express')
  , request = require('request')
  , twilio = require('twilio')
  , util = require('util')
  , app = express()
  , port
  , TwimlResponse

app.get('/', function(req, res) {

  var sendMessage = ((req.query && req.query.Body) ? req.query.Body.split(" ") : null)
    , lookupDomain
    , longStringReplies
    , TwimlResponse = new twilio.TwimlResponse()

  res.header("content-type", "text/xml")
  if (sendMessage === null) {
    res.send(500, TwimlResponse.message("Invalid SMS request").toString())
  }
  else if (sendMessage !== null && sendMessage.length !== 2 && sendMessage[0].toLowerCase() !== "dom") {
    res.send(200, TwimlResponse.message("Please send 'dom <domain name>' to lookup <domain name> status").toString())
  }
  else {
    lookupDomain = sendMessage[1].toLowerCase().replace(/[^a-z0-9\.\-]+/,'')
    longStringReplies = ""

    request.get("https://domai.nr/api/json/info?q=" + lookupDomain, function (err, response, body) {
      var info = JSON.parse(body)
        , output

      if (err) {
        output = "Unable to look up domain(s): " + lookupDomain
      }
      else if (response.statusCode == 200) {
        output = "The domain " + info.domain + " is " + (info.availability !== "taken" ? "" : "not ") + "available"
      }
      else {
        output = "Unable to get information about: " + lookupDomain
      }
      res.send(200, TwimlResponse.message(output).toString())
    })
  }
});

port = Number(process.env.PORT || 5000)
app.enable('trust proxy')
app.listen(port, function() {
  console.log("Listening on " + port);
});
