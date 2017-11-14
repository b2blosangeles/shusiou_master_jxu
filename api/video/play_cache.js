
function write404(msg) {
	res.writeHead(404);
	res.write(msg);
	res.end();	
}

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
		if (!error && (results.length)) cbk(results[0].server_ip);
		else { cbk(false); CP.exit = 1; }
	});	
};
_f['S1'] = function(cbk) { 
	var connection = mysql.createConnection(cfg0);
	connection.connect();
	var str = "SELECT A.`vid`, A.`node_ip`, B.`server_ip`, A.`status` "+    
			 " FROM `video_node` AS A LEFT JOIN `video` AS B  ON A.`vid` = B.`vid` " +
			 " WHERE  A.`node_ip` IN (SELECT `node_ip` FROM `cloud_node` WHERE score < 1000) AND A.`vid` = '" + vid + "'; ";	
	connection.query(str, function (error, results, fields) {
		connection.end();
		cbk(results);
	});	
};
_f['NS0'] = function(cbk) { 
	var ips = [false];
	for(var i=0; i < CP.data.S1.length; i++) {
		ips[ips.length] = "'" + CP.data.S1[i].node_ip + "'";
	}
	var connection = mysql.createConnection(cfg0);
	connection.connect();
	var str = "SELECT `node_ip`  FROM `cloud_node`  " +
		 " WHERE `node_ip` NOT IN (" + ips.join(',') + ") AND `free` > 50 AND `score` < 1000 ORDER BY `free` ASC LIMIT 2; ";
	connection.query(str, function (error, results, fields) {
		connection.end();
		cbk([]);
		/*
		if (!error) cbk(results);
		else cbk([]);
		*/
	});	
};
_f['NS1'] = function(cbk) { 
	var v = [];
	for (var i=0; i<CP.data.NS0.length; i++) {
		v[v.length] = "('" + CP.data.NS0[i].node_ip +"', '" + vid + "')";
	}
	var connection = mysql.createConnection(cfg0);
	connection.connect();
	var str = "INSERT INTO `video_node` (`node_ip`, `vid`) VALUES " +  v.join(',') + 
	" ON DUPLICATE KEY UPDATE `vid` = '" + vid + "'";
	connection.query(str, function (error, results, fields) {									       
		cbk(true); 	
	});	
};

CP.serial(
	_f,
	function(data) {
		if (CP.data.S0) var server_ip = CP.data.S0;
		else {
			write404('Wrong vid '+ vid);
			return true;
		}
		var ips = [], ip_cache_uncompleted = {};
		for (var i = 0; i<CP.data.S1.length; i++) { 
			ips[ips.length] = CP.data.S1[i].node_ip; 
			if (!CP.data.S1[i].status) {
				ip_cache_uncompleted[CP.data.S1[i].node_ip] = 1;
			}
		}
		
		for (var i = 0; i< Math.min(2 -CP.data.S1.length, CP.data.NS0.length); i++) { 
			ips[ips.length] = CP.data.NS0[i].node_ip;
		}
				
		var ip = ips[Math.floor(Math.random() * ips.length)], patt = /([?&]server)=([^#&]*)/i;
		//if (!ip_cache_uncompleted[ip]) {
		//	if (patt.test(url)) url = ('http://'+ ip + url).replace(patt,'$1=' + server_ip);
		//	else url = 'http://'+ ip + url + '&server=' + server_ip;
		//} else {
			url = 'http://'+ server_ip + url;
		//}
	//	res.send(url)
		res.redirect(url);
	},
	30000
);   
