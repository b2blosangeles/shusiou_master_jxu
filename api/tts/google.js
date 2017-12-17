var str = req.param('str'), lang = req.param('lang');
if (!str) {
	res.send('No string sent!');
	return false;
}
if (!lang) {
	res.send('No lang!');
	return false;
}
var sh = require(env.site_path + '/api/inc/shorthash/node_modules/shorthash');
var code = sh.unique(str); 
var tts_dir = '/var/tts/' + lang + '/';
var fn = tts_dir + code +'.mp3';

var mysql = require(env.site_path + '/api/inc/mysql/node_modules/mysql'),
	config = require(env.config_path + '/config.json'),
	folderP = require(env.site_path + '/api/inc/folderP/folderP'),
	cfg0 = config.db,
	fp = new folderP();

var CP = new pkg.crowdProcess(), _f = {};

_f['DR1'] = function(cbk) { /* create tts path */
	fp.build(tts_dir, function() {
		cbk(tts_dir);
	});
};
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

_f['code_cache'] = function(cbk) { 
	var connection = mysql.createConnection(cfg0);
	connection.connect();
	var str ="SELECT * FROM `tts_cache` WHERE `code` = '" + code + "' AND  `lang` = '" + lang + "'; ";
	connection.query(str, function (err, results, fields) {
		connection.end();
		if (err) { 
			cbk(err.message);
			CP.exit = 1;
		} else if (results[0]) { 
			cbk(results[0]);
			CP.exit = 1;
		} else {
			cbk(false);
		}	
		
	});  
};
_f['create_cache'] = function(cbk) { 
	
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
		cbk(true);
	})
	.catch(function (err) {
	   	cbk(false);
	});	
	
};
_f['save_mark'] = function(cbk) { 
	if (!CP.data.create_cache) {
		cbk(false);
		return true;
	} else {
		var connection = mysql.createConnection(cfg0);
		connection.connect();
		var str ="SELECT * FROM `tts_cache` WHERE `code` = '" + code + "' AND  `lang` = '" + lang + "'; ";
		connection.query(str, function (err, results, fields) {
			connection.end();
			if (err) { 
				cbk(err.message);
				CP.exit = 1;
			} else if (results[0]) { 
				cbk(results[0]);
				CP.exit = 1;
			} else {
				cbk(false);
			}	

		}); 
	}
};
CP.serial(
	_f,
	function(data) {
		res.send(fn);
		// res.send(JSON.stringify({_spent_time:data._spent_time, status:data.status, data:data}));
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
