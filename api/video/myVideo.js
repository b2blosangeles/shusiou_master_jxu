var ytdl = require(env.site_path + '/api/inc/ytdl-core/node_modules/ytdl-core'),
    mysql = require(env.site_path + '/api/inc/mysql/node_modules/mysql'),
    cfg0 = require(env.site_path + '/api/cfg/db.json');

var opt = req.query['opt'];

switch(opt) {
	case 'add':
		var uid = req.body.uid || 1, 
		    source = req.body.source || 'ytdl-core',
		    code = req.body.code || 'https://youtu.be/K7AUKcrIdWU';

		var CP = new pkg.crowdProcess();
		var _f = {};
		
		_f['A0'] = function(cbk) {
			var connection = mysql.createConnection(cfg0);
			connection.connect();

			var str = "SELECT A.`*`, B.`uid` FROM `download_failure` A RIGHT JOIN `video_user` B ON A.`id` = B.`video_code` WHERE 1; ";
			connection.query(str, function (error, results, fields) {
				connection.end();
				if (results.length) { cbk(results); }
				else cbk(false);
			});  
			CP.exit = 1;
		};		
		_f['P0'] = function(cbk) {
			var connection = mysql.createConnection(cfg0);
			connection.connect();

			var str = "SELECT `id` FROM `download_queue` WHERE `source` = '" + source + "' AND code = '" + code.replace(/\'/g, "\\\'") + "'; ";
			connection.query(str, function (error, results, fields) {
				connection.end();
				if (results.length) { cbk(results[0]); }
				else cbk(false);
			});  
		};
		_f['P1'] = function(cbk) {
			var connection = mysql.createConnection(cfg0);
			connection.connect();

			var str = "SELECT `id`, `video_code` FROM `video` WHERE `source` = '" + source + "' AND code = '" + code.replace(/\'/g, "\\\'") + "'; ";
			connection.query(str, function (error, results, fields) {
				connection.end();
				if (results.length) { cbk(results[0]);}
				else cbk(false);
			});  
		};
		_f['pv'] = function(cbk) {
			if ((CP.data.P0) || (CP.data.P1)) {
				var code = '';
				if (CP.data.P1) code = CP.data.P1.video_code;
				else if (CP.data.P0) code = CP.data.P0.id;
				
				CP.exit = 1; 
				var connection = mysql.createConnection(cfg0);
				connection.connect();
				var str = 'INSERT INTO `video_user` ' +
				    '(`video_code`, `uid`, `created`) VALUES (' +
				     "'" + code + "'," +
				     "'" + uid + "'," +
				    'NOW()) ON DUPLICATE KEY UPDATE  `created` = `created` ';
				connection.query(str, function (error, results, fields) {
					connection.end();
					cbk(code); 
				}); 				
				
				
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
				if (results.insertId) cbk(results.insertId);
				else cbk(false);
			});  
		};
		_f['P4'] = function(cbk) {
			if (CP.data.P3) {
				var connection = mysql.createConnection(cfg0);
				connection.connect();
				var str = 'INSERT INTO `video_user` ' +
				    '(`video_code`, `uid`, `created`) VALUES (' +
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
				res.send(data);
				return true;
				if (data.results.pv) {
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
	case 'getMyVideos':
		var uid = req.body.uid || 1;
		var CP = new pkg.crowdProcess();
		var _f = {};
		_f['P1'] = function(cbk) {
			var connection = mysql.createConnection(cfg0);
			connection.connect();

			var str = 'SELECT * FROM  `download_queue` WHERE `uid` = "' + uid +' "';

			connection.query(str, function (error, results, fields) {
				connection.end();
				if (results.length)  cbk(results);
				else cbk(false);
			});  
		};
		_f['P2'] = function(cbk) {
			var connection = mysql.createConnection(cfg0);
			connection.connect();

			var str = 'SELECT * FROM  `video` WHERE 1';

			connection.query(str, function (error, results, fields) {
				connection.end();
				if (results.length)  cbk(results);
				else cbk(false);
			});  
		};		
		CP.serial(
			_f,
			function(data) {
				//res.send(CP.data.P1);
				res.send(data);
			},
			3000
		);
		break;		
	default:
		res.send({status:'error', message:'Wrong opt value!'});
}
