var Browser = require('zombie'),
   mongoose = require('mongoose');



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

var visit = function(path, callback){
	var browser = new Browser();
	browser.visit(path, function(){
		browser.wait(1000,function(){
			var html = null;
			try{
				html = browser.html();
			}catch(e){console.log(e)};
			calback(html);
		});
	});
}

exports.handleCrawler = function(req, res, next){
 
  var fragment = req.query._escaped_fragment_;
  
  console.log(fragment);
  if(fragment != null) {
 
    // Serve index template for root
    if(fragment == "" || fragment == "/") {
        fragment = "/index.html";
    }
 
    // Check if fragment starts with "/"
    if(fragment.charAt(0) != "/") {
        fragment = "/" + fragment;
    }
 
    // Check if fragment ends with html
    if(fragment.indexOf(".html", this.length - 5) == -1) {
        fragment += ".html";
    }
 
    // Serve template or 404
    try {
    	fragment = fragment.substring(0, fragment.length-5);
    	Snapshot.findOne({path: fragment}, 'snapshot, lastMod', function(error, result){
    		if(result)
    			res.send(result.snapshot);
    		else
    			visit("localhost:3000/"+fragment, function(html){
    				if(html!=null){
    					var snaphot = new Snapshot({path: fragment, snapshot: html});
    					snapshot.save();
    				}
    				res.send(html);
    			});
    	});

    } catch(err) {
        res.send(404);
    }
  }else{
     next();
  }
 
};

