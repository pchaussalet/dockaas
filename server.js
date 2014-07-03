var restify = require('restify');

var app = require('./routes/app');

var server = restify.createServer();
server.use(restify.queryParser());
server.use(restify.gzipResponse());
server.use(restify.bodyParser());

server.get('app', app.list);
server.post('/app/:name', app.create);

server.listen(8080, function() {
    console.log('%s listening at %s', server.name, server.url);
});