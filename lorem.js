'use strict';

var express = require('express'); // do not change this line

var server = express();

server.get('/lorem', function(req, res) {
	res.status(200);
	res.set({ 'Content-Type': 'text/html' });
	res.write('<!DOCTYPE html><html><body>lorem ipsum</body></html>');
	res.end();
});

server.listen(process.env.PORT || 8080);

// create an express server that listens on port: process.env.PORT || 8080
// on a get request of '/lorem', respond with a webpage containing '<!DOCTYPE html><html><body>lorem ipsum</body></html>'
