var type= req.query['type'], vid = req.query['vid'];
if (!type || !vid) {  write404('vid or type error '); return true; }

var mysql = require(env.site_path + '/api/inc/mysql/node_modules/mysql'),
    cfg0 = require(env.site_path + '/api/cfg/db.json');

var url = req.url.replace('/play_cache.api', '/play_stream.api');

var CP = new pkg.crowdProcess();
var _f = {};

_f['S0'] = function(cbk) { 
	cbk(true);
};
_f['S1'] = function(cbk) { 
	var connection = mysql.createConnection(cfg0);
		connection.connect();
	/*
		var str = "SELECT A.`vid`, A.`node_ip`, B.`server_ip` "+    
			 " FROM `video_node` AS A LEFT JOIN `video` AS B  ON A.`vid` = B.`vid` " +
			 " WHERE A.`vid` = '" + vid + "' AND A.`status` = '1'; ";
	*/
		var str = "SELECT * "+    
			 " FROM `cloud_node`  " +
			 " WHERE 1 ORDER BY `free` ASC; ";

		connection.query(str, function (error, results, fields) {
			connection.end()
			if (error)  cbk(url);
			else if (results) { 
				var v = [];
				for (var i = 0; i < results.length; i++) {
					v[v.length] = results[i];
				}
				if (!v.length) {
					cbk(url);
				} else {
					var vi =  v[Math.floor(Math.random() * v.length)], patt = /([?&]server)=([^#&]*)/i;
					if (patt.test(url)) url = ('http://'+ vi['node_ip'] + url).replace(patt,'$1=' + vi['server_ip']);
					else url = 'http://'+ vi['node_ip'] + url + '&server=' + vi['server_ip'];
					cbk(url);
				}	
			} else cbk(url);
		});  
}

CP.serial(
	_f,
	function(data) {
		res.send(data);
	},
	30000
);   
return true;

function write404(msg) {
	res.writeHead(404);
	res.write(msg);
	res.end();	
}
