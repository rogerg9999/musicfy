var express = require('express'),
   mongoose = require('mongoose'),
   cheerio = require('cheerio'),
   request = require('request');

/*
 * GET users listing.
 */

exports.list = function(req, res){
  res.send("respond with a resource");
};

exports.search = function(req, res){
	var query = req.params.query;
	skull(query, function(data){
		res.send(data);
	});
};


mongoose.connect('mongodb://localhost/music');

var Schema = mongoose.Schema;

var cacheSchema = new Schema({
	query: String,
	response: String,
	lastMod: Date
});

cacheSchema.pre('save', function (next) {
    this.lastMod = new Date();
    next();
  });

var Cache = mongoose.model('Cache', cacheSchema);

var SKULL_MAIN_URL = "http://mp3skull.com"; 
var SKULL_URL = "http://mp3skull.com/mp3/";
var SKULL_LINK_SELECTOR = "div:first-child>a";
var SKULL_TITLE_SELECTOR = "b";
var SKULL_PARENT_SELECTOR = "div[id=right_song]";


var skull = function(query, callback){
	var url = query!='main'?SKULL_URL + query + ".html": SKULL_MAIN_URL;
	fetch(url, SKULL_PARENT_SELECTOR, SKULL_LINK_SELECTOR, SKULL_TITLE_SELECTOR, callback);
}

var fetch = function(url, parentSelector, linkSelector, titleSelector, callback){

	Cache.findOne({query: url}, 'lastMod, response', function(error, result){

		if(result && result.lastMod && result.response){
			if(!isOld(result.lastMod)){
				callback(result.response);
			}
			else{
			  Cache.remove({query: url});
			  scrap(url, parentSelector, linkSelector, titleSelector, callback);
			}
		}
		else{
			scrap(url, parentSelector, linkSelector, titleSelector, callback);
		}
	});
}

var scrap = function(url, parentSelector, linkSelector, titleSelector, callback){
	request(url, function(err, resp, body){
  	$ = cheerio.load(body);
  	var parent = $(parentSelector);
  	var links =  $(parent).find(linkSelector);
  	var b = $(parent).find(titleSelector);
  	var hrefs = [];
  	var titles= [];
  	$(links).each(function(i, link){
  		hrefs.push($(link).attr('href'));
  	});
  	$(b).each(function(i, title){
  		titles.push($(title).text());
  	});
  	var elems = [];
    for(var i = 0; i< hrefs.length && i < titles.length; i++){
    	var title = titles[i];
    	var href = hrefs[i];
    	var obj = new Object();
    	obj.title = title;
    	obj.href = href;
    	elems.push(obj);
    }
    var data = null;
    if(elems.length){
    	data = JSON.stringify(elems);
    	var entry = new Cache({'query': url, 'response': data});
			entry.save(function(error){
				if(error)
					console.log(error);
				Cache.findOne({query:url}, 'response', function(error, result){
					callback(result);
				});
			});
    }else{
    	callback(data);
    }
  });
}