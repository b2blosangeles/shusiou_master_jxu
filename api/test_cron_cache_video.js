var mysql = require(env.site_path + '/api/inc/mysql/node_modules/mysql'),
    cfg0 = require(env.site_path + '/api/cfg/db.json');


var CP_s = new pkg.crowdProcess();
var _f_s = {};		
_f_s['ip']  = function(cbk_s) {
    pkg.fs.readFile('/var/.qalet_whoami.data', 'utf8', function(err,data) {
	if ((err) || !data) {
		cbk_s(false); CP_s.exit = 1;		
	} else {
		cbk_s(data.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g,'').replace(/\s+/g,' '));
	}
    });
};
_f_s['need_remove']  = function(cbk_s) { /* get database catched local videos */
	var connection = mysql.createConnection(cfg0);
	connection.connect();
	var str = 'SELECT A.`vid` FROM `video_node` A LEFT JOIN `video` B ' +
		' ON A.`vid` = B.`vid`  ' +
		' WHERE  B.`server_ip` = "' + CP_s.data.ip + '" AND A.`node_ip` IN (SELECT `node_ip` FROM `cloud_node` WHERE score < 1000) ' +
		' GROUP BY A.`vid` ' +
		' HAVING count(A.`vid`) > (SELECT `cache` FROM `video_cache` WHERE `vid` = A.`vid` UNION SELECT 1 LIMIT 1)  ' +
		' ORDER BY count(A.`vid`) ASC LIMIT 10';
	
		connection.query(str, function (error, results, fields) {
		connection.end();
		if (error || !results.length) {
			cbk_s(false); CP_s.exit = 1;
		}
		var v = [];
		for (var i=0; i < results.length; i++) v[v.length] = results[i].vid;
		if (v.length) {
			var str = 'DELETE FROM `video_node` WHERE `vid` IN (' + v.join(',') + ')';
			cbk_s(str);
		} else {
			cbk_s(false);
		}	
	});
};
_f_s['need_add']  = function(cbk_s) { /* get database catched local videos */
	var connection = mysql.createConnection(cfg0);
	connection.connect();
	var str = 'SELECT A.`vid`,  count(A.`vid`) as CNT FROM `video_node` A LEFT JOIN `video` B ' +
		' ON A.`vid` = B.`vid`  ' +
		' WHERE  A.`node_ip` IN (SELECT `node_ip` FROM `cloud_node` WHERE score < 1000) ' +
		' GROUP BY A.`vid` ' +
		' HAVING CNT < (SELECT `cache` FROM `video_cache` WHERE `vid` = A.`vid` UNION SELECT 2 LIMIT 1)  ' +
		' ORDER BY CNT  ASC LIMIT 2';
	
		connection.query(str, function (error, results, fields) {
		connection.end();
		if (error || !results.length) {
			cbk_s(false); CP_s.exit = 1;
		}
		var v = [];
		// for (var i=0; i < results.length; i++) v[v.length] = results[i]['vid'].toString();
		for (var i=0; i < results.length; i++) v[v.length] = results[i];
		cbk_s(v);
	});
};
CP_s.serial(
	_f_s,
	function(data_s) {
		res.send(data_s);
	},
	58000
);
