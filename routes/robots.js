var Browser = require('zombie'),
   mongoose = require('mongoose');
   var fs = require('fs');



var Schema = mongoose.Schema;

var snapshotSchema = new Schema({
	path: String,
	snapshot: String,
	lastMod: Date
});

snapshotSchema.pre('save', function (next) {
    this.lastMod = new Date();
    next();
  });

var Snapshot = mongoose.model('Snapshot', snapshotSchema);

exports.visit = function(path, file){
	var browser = new Browser();
	browser.visit(path, function(){
		browser.wait(1000,function(){
			var html = null;
			try{
				html = browser.html();
                fs.writeFile(file, html, function(err){
                    if(err)
                        console.log(err);
                });
			}catch(e){console.log(e)};
		});
	});
}

exports.crawler = function(req, res, next) {
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
            visit(fragment, file);
    });
    
  } catch (err) {
    res.send(404);
  }
};

