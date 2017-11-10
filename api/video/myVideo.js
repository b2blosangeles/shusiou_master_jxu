var ytdl = require(env.site_path + '/api/inc/ytdl-core/node_modules/ytdl-core'),
    mysql = require(env.site_path + '/api/inc/mysql/node_modules/mysql'),
    cfg0 = require(env.site_path + '/api/cfg/db.json');

var opt = req.query['opt'];

switch(opt) {
	case 'add':
		var uid = req.body.auth.uid, 
		    source = req.body.source || 'ytdl-core',
		    code = req.body.code || 'https://youtu.be/K7AUKcrIdWU';

		var CP = new pkg.crowdProcess();
		var _f = {};
		
		_f['A0'] = function(cbk) {  /* Clean old download_falure related record */
			var connection = mysql.createConnection(cfg0);
			connection.connect();
			var str = "SELECT A.`id`"+    
				" FROM `download_failure` A LEFT JOIN `video_user` B ON A.`vid` = B.`vid` " +
				" WHERE B.`uid` = '" + uid + "' AND NOW() - B.`created` > 36000; ";
			connection.query(str, function (error, results, fields) {
				connection.end();
				if (error)  cbk(false);
				else if (results) { 
					var v = [];
					for (var i = 0; i < results.length; i++) {
						v[v.length] = results[i].id;
					}
					cbk(v.join(','));
				} else cbk(false);
			});  
		};
		_f['A1'] = function(cbk) {  /* Clean old download_falure related record */
			if (CP.data.A0) {
				var connection = mysql.createConnection(cfg0);
				connection.connect();
				var str ="DELETE FROM `video_user` WHERE `vid` IN (" + CP.data.A0 + "); ";
				connection.query(str, function (error, results, fields) {
					connection.end();
					if (error)  cbk(false);
					else if (results) { 
						cbk(results);
					} else cbk(false);
				});  
			} else {
				cbk(false);
			}
		};		
		_f['P0'] = function(cbk) {
			var connection = mysql.createConnection(cfg0);
			connection.connect();

			var str = "SELECT `id`, `vid` FROM `download_queue` WHERE `source` = '" + source + "' AND code = '" + code.replace(/\'/g, "\\\'") + "'; ";
			connection.query(str, function (error, results, fields) {
				connection.end();
				if (results.length) { cbk(results[0]); }
				else cbk(false);
			});  
		};
		_f['P1'] = function(cbk) {
			var connection = mysql.createConnection(cfg0);
			connection.connect();

			var str = "SELECT `id`, `vid` FROM `video` WHERE `source` = '" + source + "' AND code = '" + code.replace(/\'/g, "\\\'") + "'; ";
			connection.query(str, function (error, results, fields) {
				connection.end();
				if (results.length) { cbk(results[0]);}
				else cbk(false);
			});  
		};
		_f['PV'] = function(cbk) {
			if ((CP.data.P0) || (CP.data.P1)) {
				var code = '';
				if (CP.data.P1) code = CP.data.P1.vid;
				else if (CP.data.P0) code = CP.data.P0.vid;
				
				var connection = mysql.createConnection(cfg0);
				connection.connect();
				var str = 'INSERT INTO `video_user` ' +
				    '(`vid`, `uid`, `created`) VALUES (' +
				     "'" + code + "'," +
				     "'" + uid + "'," +
				    'NOW()) ON DUPLICATE KEY UPDATE  `created` = `created` ';
				connection.query(str, function (error, results, fields) {
					connection.end();
					cbk(code); 
				}); 
				CP.exit = 1;
			} else {
				cbk(false);
			}
			
		};
		
		_f['P2'] = function(cbk) {
			ytdl.getInfo(code, {},  function(err, info){	
			  if (err) {  
				cbk('ERR');  CP.exit = 1;	  
			  } else {
				cbk({vid:info.video_id, title:info.title, length_seconds:parseInt(info.length_seconds), thumbnail_url:info.thumbnail_url});
			  }
			});	  
		};

		_f['P3'] = function(cbk) {
			var connection = mysql.createConnection(cfg0);
			connection.connect();
			var str = 'INSERT INTO `download_queue` (`source`, `code`, `uid`, `info`, `video_length`, `org_thumbnail`, `created`, `status`) ' +
						"values ('" + source + "', '" + code.replace(/\'/g, "\\\'") + "', '" + uid + "', "+
						"'" + JSON.stringify(CP.data.P2).replace(/\'/g, "\\\'")  + "', " + 
			    			"'" + CP.data.P2.length_seconds  + "',"+
			    			"'" + CP.data.P2.thumbnail_url.replace(/\'/g, "\\\'")  + "', " +
						'NOW(), 0 ); ';

			connection.query(str, function (error, results, fields) {
				connection.end();
				if (results.insertId) {
					var vid = results.insertId * 1000000000000 + Math.floor(new Date().getTime() * 0.001);
					var str1 = 'UPDATE `download_queue` SET `vid` = "' + vid + '" WHERE `id` = "' + results.insertId + '"';
					connection.connect();
					connection.query(str1, function (error1, results1, fields1) {
						connection.end();
						cbk(vid);
					}	
					
				} else cbk(false);
			});  
		};
		_f['P4'] = function(cbk) {
			if (CP.data.P3) {
				var connection = mysql.createConnection(cfg0);
				connection.connect();
				var str = 'INSERT INTO `video_user` ' +
				    '(`vid`, `uid`, `created`) VALUES (' +
				     "'" + CP.data.P3 + "'," +
				     "'" + uid + "'," +
				    'NOW()) ON DUPLICATE KEY UPDATE  `created` = `created` ';
				connection.query(str, function (error, results, fields) {
					connection.end();
					cbk(true); 
				});			
			} else {
				cbk(false);
			}
		};
		CP.serial(
			_f,
			function(data) {
				if (data.results.PV) {
					res.send({status:'error', _spent_time:data._spent_time, message:'video exists'});
				} else if (data.results.P2 == 'ERR') {
					res.send({status:'error', _spent_time:data._spent_time, message:'video url ' + code + ' error'});
				} else {
					res.send({status:'success', _spent_time:data._spent_time, id:data.results.P3});
				}
			},
			30000
		);
		break;
	case 'getYouTubeInfo':
		ytdl.getInfo(req.body.video_url, {},  function(err, info){
		  if ((err) || !info) {
		    res.send(false);
		  } else {
		    var r = {vid:info.video_id, title:info.title, length_seconds:parseInt(info.length_seconds), thumbnail_url:info.thumbnail_url};
		    res.send(r);
		  }  
		});		
		break;
	case 'getMyVideos':
		var uid = req.body.uid || 1;
		var CP = new pkg.crowdProcess();
		var _f = {};
		_f['P0'] = function(cbk) {
			var connection = mysql.createConnection(cfg0);
			connection.connect();

			var str = 'SELECT *, `created` AS addtime FROM  `download_queue` WHERE `uid` = "' + uid +'"';

			connection.query(str, function (error, results, fields) {
				connection.end();
				if (results.length)  cbk(results);
				else cbk([]);
			});  
		};
		_f['P1'] = function(cbk) {
			var connection = mysql.createConnection(cfg0);
			connection.connect();

			var str = 'SELECT A.*, B.`created` AS addtime FROM  `download_failure` A  LEFT JOIN `video_user` B on A.`id` = B.`video_code` ' +
			    " WHERE B.`uid` = '" + uid +" '";


			connection.query(str, function (error, results, fields) {
				connection.end();
				if (results.length)  cbk(results);
				else cbk([]);
			});  
		};		
		_f['P2'] = function(cbk) {
			var connection = mysql.createConnection(cfg0);
			connection.connect();

			var str = 'SELECT A.*, B.`created` AS addtime FROM  `video` A LEFT JOIN `video_user` B on A.`video_code` = B.`video_code` ' +
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
				for (var i = 0; i < data.results.P0.length; i++) {
					d[d.length] = data.results.P0[i];
				}				
				for (var i = 0; i < data.results.P1.length; i++) {
					d[d.length] = data.results.P1[i];
				}
				for (var i = 0; i < data.results.P2.length; i++) {
					d[d.length] = data.results.P2[i];
				}
				res.send({status:data.status, _spent_time:data._spent_time, 
					data:d.sort(function(a,b) { return ( a.addtime < b.addtime )?1:-1} )});
					  
			},
			3000
		);
		break;	
	case 'getYouTubeInfo':
		ytdl.getInfo(req.body.video_url, {},  function(err, info){
		  if ((err) || !info) {
		    res.send(false);
		  } else {
		    var r = {vid:info.video_id, title:info.title, length_seconds:parseInt(info.length_seconds), thumbnail_url:info.thumbnail_url};
		    res.send(r);
		  }  
		});		
		break;
	case 'removeUserVideo':
		var uid = req.body.auth.uid, video_code = req.body.video_code;
		var CP = new pkg.crowdProcess();
		var _f = {};
		_f['P1'] = function(cbk) {
			var connection = mysql.createConnection(cfg0);
			connection.connect();

			var str = "DELETE FROM  `video_user` WHERE `uid` = '" + uid +"'  AND `video_code` = '" + video_code + "'";

			connection.query(str, function (error, results, fields) {
				connection.end();
				if (results)  cbk(results);
				else cbk(false);
			});  
		};		
		CP.serial(
			_f,
			function(data) {				
				res.send({status:data.status, _spent_time:data._spent_time, data:data.results});
			},
			3000
		);
		break;			
	default:
		res.send({status:'error', message:'Wrong opt value!'});
}
