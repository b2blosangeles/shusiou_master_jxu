var 	ytdl = require(env.site_path + '/api/inc/ytdl-core/node_modules/ytdl-core'),
	mysql = require(env.site_path + '/api/inc/mysql/node_modules/mysql'),
	cfg0 = require(env.site_path + '/api/cfg/db.json'),
    	CP = new pkg.crowdProcess();

var opt = req.query['opt'];

var _f = {};
_f['P1'] = function(cbk) {
	var connection = mysql.createConnection(cfg0);
	connection.connect();
	var str = 'DELETE FROM `download_queue` WHERE `id` IN (SELECT `video_code` FROM `download_success`) ';
	connection.query(str, function (error, results, fields) {
		connection.end();
		if (error) {
			cbk(false);
		} else {
			if (results) {
				cbk(results);
			} else {
				cbk(false);
			}

		}
	});  
};

_f['P2'] = function(cbk) {
	var connection = mysql.createConnection(cfg0);
	connection.connect();
	var str = 'INSERT INTO `download_queue` (`source`, `code`, `info`) SELECT `source`, `code`, `video_info` FROM `download_success` ';
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
