let mysql = require(env.site_path + '/api/inc/mysql/node_modules/mysql'),
    config = require(env.config_path + '/config.json'),
    cfg0 = config.db;

let CP = new pkg.crowdProcess(),
    _f = {};
/*
_f['dns_matrix'] = function(cbk) {
	var connection = mysql.createConnection(cfg0);
	connection.connect();	
	var str = 'SELECT `node_ip` from `cloud_node` WHERE `score` < 900 ORDER BY `node_ip` ASC ';
	connection.query(str, function (error, results, fields) {
		connection.end();
		if (results.length)  cbk(results.length);
		else cbk(0);
	}); 				
}
_f['P1'] = function(cbk) {
	var connection = mysql.createConnection(cfg0);
	connection.connect();
	var str = 'SELECT A.*, B.`created` AS addtime, C.`status` AS space_status, C.`space` FROM  `video` A ' +
	    ' LEFT JOIN `video_user` B ON A.`vid` = B.`vid` ' +
	    ' LEFT JOIN `video_space` AS C ON A.`vid` = C.`vid` ' +
	    " WHERE space_status = 1 ORDER BY A.`uploaded` DESC LIMIT 3";

	connection.query(str, function (error, results, fields) {
		connection.end();
		if (results.length)  cbk(results);
		else cbk([]);
	});  
};
*/

CP.serial(
	_f,
	function(data) {
		let d = [];
		for (var i = 0; i < CP.data.P1.length; i++) {
			CP.data.P1[i].dns_matrix = CP.data.dns_matrix;
			d.push(data.results.P1[i]);
		}		
		res.send({_spent_time:data._spent_time, status:data.status, data:d});
	},
	6000
);
