var express = require('express')
  , Twilio = require('twilio')
  , Namecheap = require('namecheap')
  , app = express()
  , port
  , TwimlResponse
  , namecheap = new Namecheap(process.env.NAMECHEAP_USER, process.env.NAMECHEAP_PASS, process.env.NAMECHEAP_CLIENTIP);

if (!process.env.NAMECHEAP_USER || !process.env.NAMECHEAP_PASS || !process.env.NAMECHEAP_CLIENTIP) {
  console.error("*** You need to set your Namecheap credentials ***")
  console.error("To do so set NAMECHEAP_USER, NAMECHEAP_PASS, NAMECHEAP_CLIENTIP")
  process.exit(1)
}

app.get('/', function(req, res) {

  var sendMessage = ((req.query && req.query.Body) ? req.query.Body.split(" ") : null)
    , lookupDomain
    , longStringReplies
    , TwimlResponse = new Twilio.TwimlResponse()

  res.header("content-type", "text/xml")
  if (sendMessage === null) {
    res.send(500, TwimlResponse.message("Invalid SMS request").toString())
  }
  else if (sendMessage !== null && sendMessage.length !== 2 && sendMessage[0].toLowerCase() !== "dom") {
    res.send(200, TwimlResponse.message("Please send 'dom <domain name>' to lookup <domain name> status").toString())
  }
  else {
    lookupDomains = sendMessage.slice(1)
    longStringReplies = ""

    namecheap.domains.check(lookupDomains, function(err, resp) {
      if (err) {
        res.send(200, TwimlResponse.message("Unable to look up domain(s): " + lookupDomains.join(", ")).toString())
      }
      else {
        resp.DomainCheckResult = Array.isArray(resp.DomainCheckResult) ? resp.DomainCheckResult : [resp.DomainCheckResult]
        resp.DomainCheckResult.forEach(function(domain) {
          TwimlResponse.message("The domain " + domain.Domain + " " + (domain.Available ? "is available" : "is not available"))
        })
        res.send(200, TwimlResponse.toString())

      }
    });
  }
});

port = Number(process.env.PORT || 5000)
app.listen(port, function() {
  console.log("Listening on " + port);
});
