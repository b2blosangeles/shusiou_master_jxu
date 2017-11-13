var type= req.query['type'], vid = req.query['vid'];
if (!type || !vid) {  write404('vid or type error '); return true; }

var mysql = require(env.site_path + '/api/inc/mysql/node_modules/mysql'),
    cfg0 = require(env.site_path + '/api/cfg/db.json');

var url = req.url.replace('/play_cache.api', '/play_stream.api');

var CP = new pkg.crowdProcess();
var _f = {};

_f['S0'] = function(cbk) { 
	var connection = mysql.createConnection(cfg0);
	connection.connect();
	var str = "SELECT * FROM `video` WHERE `vid` =  '" + vid + "'; ";	
	connection.query(str, function (error, results, fields) {
		connection.end();
		cbk(results[0].server_ip);
	});	
};
_f['S1'] = function(cbk) { 
	var connection = mysql.createConnection(cfg0);
	connection.connect();
	var str = "SELECT A.`vid`, A.`node_ip`, B.`server_ip`, A.`status` "+    
			 " FROM `video_node` AS A LEFT JOIN `video` AS B  ON A.`vid` = B.`vid` " +
			 " WHERE A.`vid` = '" + vid + "'; ";	
	connection.query(str, function (error, results, fields) {
		connection.end();
		if (results.length > 1) {
			cbk(results); 
		} else {
			cbk(results);
		}
	});	
};
_f['NS0'] = function(cbk) { 
	var connection = mysql.createConnection(cfg0);
	connection.connect();
	var str = "SELECT `node_ip`  FROM `cloud_node`  " +
		 " WHERE `score` < 1000 ORDER BY `free` ASC LIMIT 2; ";
	connection.query(str, function (error, results, fields) {
		connection.end();
		if (!error) cbk(results);
		else cbk([]);
	});	
};
_f['NS1'] = function(cbk) { 
	var CP1 = new pkg.crowdProcess();
	var _f1 = {};	

	for (var i=0; i<CP.data.NS0.length; i++) {
		_f1['P_' + i] = (function(i) {
			return function(cbk1) {
				cbk(true);
			}
		})(i);		
	}
	CP1.serial(
		_f1,
		function(data) {
			cbk(data);
		},
		10000
	); 	
};
_f['S6'] = function(cbk) { 
	cbk(CP.data.S1);
	return true;
	
	var connection = mysql.createConnection(cfg0);
		connection.connect();
		var str = "SELECT * "+    
			 " FROM `cloud_node`  " +
			 " WHERE 1 ORDER BY `free` ASC; ";

		connection.query(str, function (error, results, fields) {
			connection.end();
			if (error)  cbk(url);
			else if (results) { 
				var v = [];
				for (var i = 0; i < results.length; i++) {
					v[v.length] = results[i];
				}
				if (!v.length) {
					cbk(url);
				} else {
					var server_ip = CP.data.S0;
					var vi =  v[Math.floor(Math.random() * v.length)], patt = /([?&]server)=([^#&]*)/i;
					if (patt.test(url)) url = ('http://'+ vi['node_ip'] + url).replace(patt,'$1=' + server_ip);
					else url = 'http://'+ vi['node_ip'] + url + '&server=' + server_ip;
					cbk(url);
				}	
			} else cbk(url);
		});  
}

CP.serial(
	_f,
	function(data) {
		res.send(data);
		// res.redirect(CP.data.S6);
	},
	30000
);   
return true;

function write404(msg) {
	res.writeHead(404);
	res.write(msg);
	res.end();	
}
