var mysql = require(env.site_path + '/api/inc/mysql/node_modules/mysql');

var CP = new pkg.crowdProcess();
var _f = {};

_f['Q0'] = function(cbk) {
	var cfg0 = require(env.site_path + '/api/cfg/db.json');
	var connection = mysql.createConnection(cfg0);
	connection.connect();

	var str = 'SELECT A.* FROM  `video` A LEFT JOIN `video_node` B ON A.`vid` = B.`vid` WHERE 1 ORDER BY A.`uploaded` DESC LIMIT 3';

	connection.query(str, function (error, results, fields) {
		connection.end();
		if (error) {
			cbk(error.message);
			return true;
		} else {
			cbk(results);
		}
	});  
};

CP.serial(
	_f,
	function(data) {
		var list = [];
		for (o in data.results.Q0) {
			list[list.length] = data.results.Q0[o];
		}
		res.send({_spent_time:data._spent_time, status:data.status, data:list});
	},
	6000
);
