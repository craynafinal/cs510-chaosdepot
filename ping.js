var http = require("http");

// Requests get every 10 minutes
setInterval(function() {
    http.get('http://chaosdepot.herokuapp.com');
}, 600000);
