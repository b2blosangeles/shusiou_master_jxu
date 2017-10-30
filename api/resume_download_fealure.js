var ytdl = require(env.site_path + '/api/inc/ytdl-core/node_modules/ytdl-core');
var mysql = require(env.site_path + '/api/inc/mysql/node_modules/mysql');
var cfg0 = require(env.site_path + '/api/cfg/db.json');

var CP = new pkg.crowdProcess();
var _f = {};


_f['P1'] = function(cbk) {
	var connection = mysql.createConnection(cfg0);
	connection.connect();
	var str = 'INSERT INTO `download_queue` (`source`, `code`, `info`) SELECT `source`, `code`, `video_info` FROM `download_failure` ';
	connection.query(str, function (error, results, fields) {
		connection.end();
		if (error) {
			cbk('falseB');
		} else {
			if (results) {
				cbk(results);
			} else {
				cbk('falseA');
			}

		}
	});  
};

CP.serial(
	_f,
	function(data) {
		res.send({_spent_time:data._spent_time, status:data.status, data:data});
	},
	59000
);
