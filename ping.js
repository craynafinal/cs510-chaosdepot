var http = require("http");

// Requests get every 10 minutes
setInterval(function() {
    http.get('http://chaosdepot.herokuapp.com');
		http.get('http://chaosdepot.com');
}, 600000);
