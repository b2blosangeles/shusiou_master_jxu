var ytdl = require(env.site_path + '/api/inc/ytdl-core/node_modules/ytdl-core'),
    mysql = require(env.site_path + '/api/inc/mysql/node_modules/mysql');

var opt = req.query['opt'],
    uid = req.body.uid | 1, 
    source = req.body.source | 'ytdl-core',
    code = req.body.code | 'https://youtu.be/K7AUKcrIdWU';

switch(opt) {
	case 'add':
		var CP = new pkg.crowdProcess();
		var _f = {};
		_f['P0'] = function(cbk) {
			ytdl.getInfo(code, {},  function(err, info){	
			  if (err) {  
				cbk(false);  	  
			  } else {
				cbk({vid:info.video_id, title:info.title + "asd'asd", length_seconds:parseInt(info.length_seconds), thumbnail_url:info.thumbnail_url});
			  }
			});	  
		};

		_f['P1'] = function(cbk) {
			var cfg0 = require(env.site_path + '/api/cfg/db.json');
			var connection = mysql.createConnection(cfg0);
			connection.connect();

			var str = 'INSERT INTO `download_queue` (`source`, `code`, `uid`, `info`,`created`, `status`) ' +
						"values ('" + source + "', '" + code.replace(/\'/g, "\\\'") + "', '" + uid + "', "+
						"'" + JSON.stringify(CP.data.P0).replace(/\'/g, "\\\'")  + "', " + 
						'NOW(), 0 ); ';

			connection.query(str, function (error, results, fields) {
				connection.end();
				if (error) {
					cbk(str);
				} else {
					if (results.length) {
						cbk(results[0]);
					} else {
						cbk(true);
					}

				}
			});  
		};

		CP.serial(
			_f,
			function(data) {
				res.send(CP.data.P1);
				// res.send({_spent_time:data._spent_time, status:data.status, data:data});
			},
			30000
		);
		break;
	default:
        	res.send('Wrong opt value!');
}
