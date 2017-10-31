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
		
		_f['P0'] = function(cbk) {
			var connection = mysql.createConnection(cfg0);
			connection.connect();

			var str = "SELECT `id` FROM `download_queue` WHERE `source` = '" + source + "' AND code = '" + code.replace(/\'/g, "\\\'") + "'; ";
			connection.query(str, function (error, results, fields) {
				connection.end();
				if (results.length) { cbk(results[0]); CP.exit = 1; }
				else cbk(false);
			});  
		};
		_f['P1'] = function(cbk) {
			var connection = mysql.createConnection(cfg0);
			connection.connect();

			var str = "SELECT `id` FROM `video` WHERE `source` = '" + source + "' AND code = '" + code.replace(/\'/g, "\\\'") + "'; ";
			connection.query(str, function (error, results, fields) {
				connection.end();
				if (results.length) { cbk(results[0]); CP.exit = 1; }
				else cbk(false);
			});  
		};		
		_f['P2'] = function(cbk) {
			ytdl.getInfo(code, {},  function(err, info){	
			  if (err) {  
				cbk(false);  CP.exit = 1;	  
			  } else {
				cbk({vid:info.video_id, title:info.title + "asd'asd", length_seconds:parseInt(info.length_seconds), thumbnail_url:info.thumbnail_url});
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
				if (results.length) cbk(results[0]);
				else cbk(str);
			});  
		};

		CP.serial(
			_f,
			function(data) {
				if (!data.results.P3) {
					res.send({status:'error', _spent_time:data._spent_time, message:'video exists'});
				} else {
					res.send({status:'success', _spent_time:data._spent_time, data:data.results.P3});
				}
				
				// res.send({_spent_time:data._spent_time, status:data.status, data:data});
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

			var str = 'SELECT * FROM  `download_success` WHERE 1';

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
        	res.send('Wrong opt value!');
}
