var app = function(auth_data) { 
	var ytdl = require(env.site_path + '/api/inc/ytdl-core/node_modules/ytdl-core'),
	    mysql = require(env.site_path + '/api/inc/mysql/node_modules/mysql'),
	    config = require(env.config_path + '/config.json'),
	    cfg0 = config.db;
	
	var opt = req.query['opt'];
	var uid = auth_data.uid;
	
	var connection = mysql.createConnection(cfg0);	
	
	switch(opt) {
		case 'add':
			var source = req.body.source || 'ytdl-core',
			    code = req.body.code;

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
					if (results.insertId) {
						var tm = Math.floor((new Date().getTime()- new Date('2017/12/01').getTime()) * 0.001 / 60) * 10000000000;
						var vid = results.insertId + tm;
						var str1 = 'UPDATE `download_queue` SET `vid` = "' + vid + '" WHERE `id` = "' + results.insertId + '"';
						connection.query(str1, function (error1, results1, fields1) {
							connection.end();
							cbk(vid);
						});	

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
		case 'getMyActiveVideos':
		case 'getMyVideos':
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
			_f['dns_matrix'] = function(cbk) {
				var mysql = require(env.site_path + '/api/inc/mysql/node_modules/mysql'),
				config = require(env.config_path + '/config.json'),
				cfg0 = config.db;
				let ips = [];
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
				    " WHERE B.`uid` = '" + uid +"'";

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
					for (var i = 0; i < CP.data.P0.length; i++) {
						CP.data.P0[i].status = 'pending';
						d.push(CP.data.P0[i]);
					}
					for (var i = 0; i < CP.data.P1.length; i++) {
						CP.data.P1[i].status = 'ready';
						CP.data.P1[i].dns_matrix = CP.data.dns_matrix;
						d.push(data.results.P1[i]);
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
			var vid = req.body.vid;
			var CP = new pkg.crowdProcess();
			var _f = {};			
			_f['P1'] = function(cbk) {
				var connection = mysql.createConnection(cfg0);
				connection.connect();

				var str = "DELETE FROM  `video_user` WHERE `uid` = '" + uid +"'  AND `vid` = '" + vid + "'";

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
};

delete require.cache[env.site_path + '/api/inc/auth/auth.js'];
var AUTH = require(env.site_path + '/api/inc/auth/auth.js'),
    auth = new AUTH(env, pkg, req);

// app();

auth.getUid(function(auth_data) {
	if (!auth_data.isAuth || !auth_data.uid) {
		res.send({status:'failure', message:'Auth failure'});
	} else {	
		app(auth_data);
	}
});
