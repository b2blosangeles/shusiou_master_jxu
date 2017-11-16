var ytdl = require(env.site_path + '/api/inc/ytdl-core/node_modules/ytdl-core'),
    mysql = require(env.site_path + '/api/inc/mysql/node_modules/mysql'),
    cfg0 = require(env.site_path + '/api/cfg/db.json');

var opt = req.query['opt'];

switch(opt) {
	case 'getVideos':
		var uid = req.body.uid || 1;
		var CP = new pkg.crowdProcess();
		var _f = {};		
		_f['P0'] = function(cbk) {
			var connection = mysql.createConnection(cfg0);
			connection.connect();

			var str = 'SELECT *  FROM  `video` LIMIT 3';

			connection.query(str, function (error, results, fields) {
				connection.end();
				if (results.length)  cbk(results);
				else cbk([]);
			});  
		};	
		_f['P1'] = function(cbk) {
			var vstr = '0';
			for (var i = 0; i < CP.data.P0.length; i++) {
				vstr += ',' +  CP.data.P0[i].vid; 
			}

			var connection = mysql.createConnection(cfg0);
			connection.connect();

			var str = 'SELECT * FROM  `video_node` WHERE `vid` IN (' + vstr + ')';

			connection.query(str, function (error, results, fields) {
				connection.end();
				if (results.length) {
					var v = {};
					for (var i = 0; i < results.length; i++) {
						if (!v[results[i].vid]) v[results[i].vid] = [];
						v[results[i].vid][v[results[i].vid].length] = results[i].node_ip;
					}
					cbk(v);
				} else cbk([]);
			});  
		};		
		CP.serial(
			_f,
			function(data) {
				var d = [];
				for (var i = 0; i < data.results.P1.length; i++) {
					d[d.length] = data.results.P1[i];
				}
				res.send({status:data.status, _spent_time:data._spent_time, 
					data:data.results.P1});
			//	res.send({status:data.status, _spent_time:data._spent_time, 
			//		data:d.sort(function(a,b) { return ( a.addtime < b.addtime )?1:-1} )});
					  
			},
			3000
		);
		break;	
	default:
		res.send({status:'error', message:'Wrong opt value!'});
}
