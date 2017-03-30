var express = require('express');
var path = require('path');
var app = express();

var jsforceAjaxProxy = require('jsforce-ajax-proxy');
app.all('/proxy/?*', jsforceAjaxProxy());

var port = process.env.PORT || 3000;

// Serve static files
app.use(express.static(__dirname + '/static'));

// Serve your app
console.log('Served: http://localhost:' + port);
app.listen(port);