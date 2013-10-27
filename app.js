
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var search = require('./routes/search');
var http = require('http');
var path = require('path'),
robots = require('./routes/robots');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());

app.use(function(req, res, next) {
  var fragment = req.query._escaped_fragment_;

  // If there is no fragment in the query params
  // then we're not serving a crawler
  if (!fragment) return next();

  // If the fragment is empty, serve the
  // index page
  if (fragment === "" || fragment === "/")
    fragment = "/index.html";

  // If fragment does not start with '/'
  // prepend it to our fragment
  if (fragment.charAt(0) !== "/")
    fragment = '/' + fragment;

  // If fragment does not end with '.html'
  // append it to the fragment
 // if (fragment.indexOf('.html') == -1)
   // fragment += ".html";

  // Serve the static html snapshot
  try {
    var file = __dirname + "/snapshots" + fragment;
    fs.exists(file, function(exists){
        if(exists)
            res.sendfile(file);
        else
            robots.visit(fragment, file);
    });
    
  } catch (err) {
    console.log(err);
    res.send(404);
  }
});
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}


app.get('/', routes.index);
app.get('/partials/:name', routes.partials);

app.get('/api/search/:query', search.search);


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
