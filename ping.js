var http = require("http");

// Requests get every 10 minutes
setInterval(function() {
    http.get('http://chaosdepot.herokuapp.com');
		http.get('http://chaosdepot.com');
		http.get('http://babytrader.epizy.com/baby-trader/');
		http.get('http://testwordpresstest.epizy.com/');
}, 600000);
