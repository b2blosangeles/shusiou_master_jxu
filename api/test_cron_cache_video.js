var mysql = require(env.site_path + '/api/inc/mysql/node_modules/mysql'),
    cfg0 = require(env.site_path + '/api/cfg/db.json');


var CP_s = new pkg.crowdProcess();
var _f_s = {};		
_f_s['ip']  = function(cbk_s) {
    pkg.fs.readFile('/var/.qalet_whoami.data', 'utf8', function(err,data) {
	if ((err) || !data) {
		cbk_s(false); CPs.exit = 1;		
	} else {
		cbk_s(data.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g,'').replace(/\s+/g,' '));
	}
    });
};
_f_s['db_videos']  = function(cbk_s) { /* get database catched local videos */
	var connection = mysql.createConnection(cfg0);
	connection.connect();
	// var str = "SELECT `vid` FROM `tmp_cache_video` WHERE `server_ip` = '" + CP_s.data.ip + "'";
	var str = "SELECT `vid` FROM `tmp_video_cached` WHERE 1";
	connection.query(str, function (error, results, fields) {
		//cbk_s(results);
		//return true;
		connection.end();
		if (error || !results.length) {
			cbk_s(false); CP_s.exit = 1;
		}
		var v = [];
		for (var i=0; i < results.length; i++) v[v.length] = results[i]['vid'].toString();
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
