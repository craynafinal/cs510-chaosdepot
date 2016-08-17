var http = require("http");

setInterval(function() {
    http.get("http://chaosdepot.herokuapp.com");
}, 300000);
