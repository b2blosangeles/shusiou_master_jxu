var ytdl = require(env.site_path + '/api/inc/ytdl-core/node_modules/ytdl-core'),
    mysql = require(env.site_path + '/api/inc/mysql/node_modules/mysql'),
    cfg0 = require(env.site_path + '/api/cfg/db.json');

var opt = req.query['opt'];

switch(opt) {
	case 'getVideoNode':
		var vid = req.query['vid'];

		var CP = new pkg.crowdProcess();
		var _f = {};
		
		_f['P0'] = function(cbk) {  /* Clean old download_falure related record */
			var connection = mysql.createConnection(cfg0);
			connection.connect();
			var str = "SELECT * FROM `video_node` WHERE `vid` = '" + vid + "' ";
			connection.query(str, function (error, results, fields) {
				connection.end();
				if (error)  cbk(false);
				else if (results) { 
					cbk(results);
				} else cbk(false);
			});  
		};
		CP.serial(
			_f,
			function(data) {
				res.send({status:'success', _spent_time:data._spent_time, data:data.results});
			},
			30000
		);
		break;
	default:
		res.send({status:'error', message:'Wrong opt value!'});
}
