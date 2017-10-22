var ytdl = require(env.site_path + '/api/inc/ytdl-core/node_modules/ytdl-core');
var mysql = require(env.site_path + '/api/inc/mysql/node_modules/mysql');

var uid = 1, 
    source = 'ytdl-core',
    code = 'https://youtu.be/K7AUKcrIdWU';

var CP = new pkg.crowdProcess();
var _f = {};
_f['P0'] = function(cbk) {
	ytdl.getInfo(code, {},  function(err, info){	
	  if (err) {  
		  CP.skip = 1;
		cbk(false);  
		  
	  } else {
		   CP.skip = 1;
		cbk({vid:info.video_id, title:info.title, length_seconds:parseInt(info.length_seconds), thumbnail_url:info.thumbnail_url});
	  }
	});	  
};
_f['P1'] = function(cbk) {
	var cfg0 = require(env.root_path + '/api/cfg/db.json');
//	var connection = mysql.createConnection(cfg0);
//	connection.connect();
	
	var str = 'INSERT INTO `download_queue` (`source`, `code`, `uid`, `info`,`created`, `status`) ' +
				'values ("' + source + '", "' + encodeURIComponent(code) + '", "' + uid + '", ' +
	    		//	"'" + 'encodeURIComponent(JSON.stringify(CP.data.P0))'  + "'" + 
				'NOW(), 0 ); ';
	cbk(str);
	return true
	connection.query(str, function (error, results, fields) {
	//	connection.end();
		if (error) {
			cbk(false);
		} else {
			if (results.length) {
				cbk(results[0]);
			} else {
				cbk(false);
			}

		}
	});  
};

CP.serial(
	_f,
	function(data) {
		res.send({_spent_time:data._spent_time, status:data.status, data:data});
	},
	30000
);

