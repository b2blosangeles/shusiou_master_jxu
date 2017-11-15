var ytdl = require(env.site_path + '/api/inc/ytdl-core/node_modules/ytdl-core'),
    mysql = require(env.site_path + '/api/inc/mysql/node_modules/mysql'),
    cfg0 = require(env.site_path + '/api/cfg/db.json');

var opt = req.query['opt'];

switch(opt) {
	case 'getMyVideos':
		var uid = req.body.uid || 1;
		var CP = new pkg.crowdProcess();
		var _f = {};		
		_f['P2'] = function(cbk) {
			var connection = mysql.createConnection(cfg0);
			connection.connect();

			var str = 'SELECT A.*, B.`created` AS addtime FROM  `video` A LEFT JOIN `video_user` B on A.`vid` = B.`vid` ' +
			    " WHERE B.`uid` = '" + uid +" '";

			connection.query(str, function (error, results, fields) {
				connection.end();
				if (results.length)  cbk(results);
				else cbk([]);
			});  
		};		
		CP.serial(
			_f,
			function(data) {
				var d = [];
				for (var i = 0; i < data.results.P2.length; i++) {
					d[d.length] = data.results.P2[i];
				}
				res.send({status:data.status, _spent_time:data._spent_time, 
					data:d.sort(function(a,b) { return ( a.addtime < b.addtime )?1:-1} )});
					  
			},
			3000
		);
		break;	
	default:
		res.send({status:'error', message:'Wrong opt value!'});
}
