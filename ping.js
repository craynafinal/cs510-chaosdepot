var http = require("http");
var constants = require('./constants');

// Requests get every 10 minutes
setInterval(function() {
    http.get(constants.URL_PING);
}, 600000);
