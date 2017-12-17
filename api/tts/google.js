var str = req.param('str'), lang = req.param('lang');
if (!str) {
	res.send('No string sent!');
	return false;
}
if (!lang) {
	res.send('No lang!');
	return false;
}

var tts_dir = '/var/' + lang + '/';
var mysql = require(env.site_path + '/api/inc/mysql/node_modules/mysql'),
    config = require(env.config_path + '/config.json'),
    cfg0 = config.db;

var CP = new pkg.crowdProcess(), _f = {};

_f['I0'] = function(cbk) { /* --- get server IPS --- */
	function getServerIP() {
	    var ifaces = require('os').networkInterfaces(), address=[];
	    for (var dev in ifaces) {
		var v =  ifaces[dev].filter((details) => details.family === 'IPv4' && details.internal === false);
		for (var i=0; i < v.length; i++) address[address.length] = v[i].address;
	    }
	    return address;
	};	
	var ips = getServerIP();
	cbk(ips);
};
_f['P0'] = function(cbk) { /* --- get server IP --- */
	pkg.fs.readFile('/var/.qalet_whoami.data', 'utf8', function(err,data) {
		var ips = CP.data.I0;
		if ((data) && ips.indexOf(data) != -1)  cbk(data);
		else { cbk(false); CP.exit = 1; }
	});	 
};
_f['code'] = function(cbk) { /* --- get server IP --- */
	var sh = require(env.site_path + '/api/inc/shorthash/node_modules/shorthash');
	var code = sh.unique(str); 
	cbk(code);
};
_f['code_cache'] = function(cbk) { 
	var code = CP.data.code;
	var connection = mysql.createConnection(cfg0);
	connection.connect();
	var str ="SELECT * FROM `tts_cache` WHERE `code` = '" + code + "' AND  `lang` = '" + lang + "'; ";
	connection.query(str, function (error, results, fields) {
		connection.end();
		if (error)  cbk(false);
		else if (results) { 
			cbk(results);
		} else cbk(false);
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
