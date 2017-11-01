var mysql = require(env.site_path + '/api/inc/mysql/node_modules/mysql');

var CP = new pkg.crowdProcess();
var _f = {};

_f['Q0'] = function(cbk) {
	var cfg0 = require(env.site_path + '/api/cfg/db.json');
	var connection = mysql.createConnection(cfg0);
	connection.connect();

	var str = 'SELECT * FROM  `video` WHERE 1 LIMIT 3';

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
/*
_f['Q1'] = function(cbk) {
	var cfg0 = require(env.space_path + '/api/cfg/db.json');
	var connection = mysql.createConnection(cfg0);
	connection.connect();
	var str = 'SELECT * FROM  `video_queue` WHERE 1 ORDER BY `created` DESC';
	connection.query(str, function (error, results, fields) {
		connection.end();
		if (error) {
			cbk(error.message);
			return true;
		} else {
			for (var i = 0; i < results.length; i++) {
				var matrix = JSON.parse(results[i].matrix);
				var matrix_success = 0;
				for (var j=0; j < matrix.length; j++) {
					if (parseInt(matrix[j]) == 1 || parseInt(matrix[j]) == 9) matrix_success++;
				}
				var rate = Math.round(matrix_success * 1000 / matrix.length)
				results[i].perc = rate/10;
			}
			cbk(results);
		}
	});  
};
*/

CP.serial(
	_f,
	function(data) {
		var list = [];
		for (o in data.results.Q0) {
			data.results.Q0[o].type = 'local';
			list[list.length] = data.results.Q0[o];
		}
		/*
		for (o in data.results.Q1) {
			data.results.Q1[o].type = 'remote';
			list[list.length] = data.results.Q1[o];
		}	
		*/
		res.send({_spent_time:data._spent_time, status:data.status, data:list});
	},
	30000
);
