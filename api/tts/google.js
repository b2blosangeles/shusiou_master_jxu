var str = req.param('str'), lang = req.param('lang');
if (!str) {
	res.send('No string sent!');
	return false;
}
if (!lang) {
	res.send('No lang!');
	return false;
}
var tts_dir = '/var/';
var sh = require(env.space_path + '/inc/shorthash/node_modules/shorthash');
var fn = tts_dir + sh.unique(str)+'.mp3';

 pkg.fs.stat(fn, function(err, data) {
     // if (err) {  
     if (true) { 	     
	var googleTTS = require(env.space_path + '/api/lang_space/inc/google-tts-api/node_modules/google-tts-api/');
	googleTTS(str, lang, 1)   // speed normal = 1 (default), slow = 0.24 
	.then(function (url) {
	   var fs = require('fs');
	   var text = 'Hello World';
	   var options = {
	      url: url,
	      headers: {
		 'Referer': 'http://translate.google.com/',
		 'User-Agent': 'stagefright/1.2 (Linux;Android 5.0)'
	      }
	   }
	   var p = pkg.request(options);
	      p.pipe(fs.createWriteStream(fn));
	      p.pipe(res);
	})
	.catch(function (err) {
	   res.send(err.stack);
	});
     } else { 
	     res.sendFile(fn);
	     return true; 
    }	     
});
return true;
