var str = req.param('str'), lang = req.param('lang');
if (!str) {
	res.send('No string sent!');
	return false;
}
if (!lang) {
	res.send('No lang!');
	return false;
}

var CP = new pkg.crowdProcess(), _f = {};

_f['P0'] = function(cbk) { /* --- get server IP --- */
    pkg.fs.readFile('/var/.qalet_whoami.data', 'utf8', function(err,data) {
	if ((data) && ips.indexOf(data) != -1)  cbk(data);
	else { cbk(false); CP.exit = 1; }
    });	 
};
CP.serial(
	_f,
	function(data) {
		res.send(JSON.stringify({_spent_time:data._spent_time, status:data.status, data:data}));
	},
	58000
);
return true;

var tts_dir = '/var/' + lang + '/';
var sh = require(env.site_path + '/api/inc/shorthash/node_modules/shorthash');
var code = sh.unique(str);
var fn = tts_dir + sh.unique(str)+'.mp3';
res.send(code);
return true;
 pkg.fs.stat(fn, function(err, data) {
     // if (err) {  
     if (true) { 	     
	var googleTTS = require(env.site_path + '/api/inc/google-tts-api/node_modules/google-tts-api/');
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
