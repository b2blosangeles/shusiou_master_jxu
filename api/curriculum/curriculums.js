var mysql = require(env.site_path + '/api/inc/mysql/node_modules/mysql'),
     	CP = new pkg.crowdProcess(),
	config = require(env.config_path + '/config.json'),
	cfg0 = config.db;

var connection = mysql.createConnection(cfg0);
switch(req.body.cmd) {
	case 'getPublicList':
		var _f = {};
		_f['S1'] = function(cbk) {
			var connection = mysql.createConnection(cfg0);
			var str = 'SELECT A.*, B.vid, B.server_ip FROM `curriculums` A LEFT JOIN `video` B  ON A.vid = B.vid WHERE A.published = 1;';
			connection.query(str, function (error, results, fields) {
				if (error) {
					cbk(error.message);
					return true;
				} else {
					cbk(results);
				}
			});  
		};
		connection.connect();
		CP.serial(
			_f,
			function(data) {
				connection.end();
				res.send({_spent_time:data._spent_time, status:data.status, data:data.results.S1});
			},
			3000
		);
		break;			
	default:
		res.send({seatus:'error', message:'Missing or Wrong CMD!'});
}		
