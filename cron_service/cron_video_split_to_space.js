/* ---  This cron is to appoint node for video. add record link only */
/* ---  chennel only related with user video, not related with video only */
var path = require('path');
var env = {root_path:path.join(__dirname, '../..')};
env.site_path = env.root_path + '/site';
env.site_path = env.root_path + '/site';
env.config_path = '/var/qalet_config';

var config = require(env.config_path + '/config.json');

let pkg = {
    	mysql		: require(env.site_path + '/api/inc/mysql/node_modules/mysql'),
    	crowdProcess	: require(env.root_path + '/package/crowdProcess/crowdProcess'),
	request		: require(env.root_path + '/package/request/node_modules/request'),
	exec		: require('child_process').exec,
	fs 		: require('fs')
}; 

/*
let awsS3Video = require(env.site_path + '/api/inc/awsS3Video/awsS3Video.js');
var splitVideo = new awsS3Video(config, env, pkg);		
splitVideo.run(function(data) {
        console.log(data);
      }
  );
*/

var CP = new pkg.crowdProcess();
var _f = {};	

_f['ip']  = function(cbk) {
    pkg.fs.readFile('/var/.qalet_whoami.data', 'utf8', function(err,data) {
	if ((err) || !data) {
		cbk(false); CP.exit = 1;		
	} else {
		cbk(data.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g,'').replace(/\s+/g,' '));
	}
    });
};
_f['ip']  = function(cbk) {
    pkg.fs.readFile('/var/.qalet_whoami.data', 'utf8', function(err,data) {
	if ((err) || !data) {
		cbk(false); CP.exit = 1;		
	} else {
		cbk(data.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g,'').replace(/\s+/g,' '));
	}
    });
};
_f['db_video']  = function(cbk) { /* get database catched local videos */
	var connection = pkg.mysql.createConnection(config.db);
	connection.connect();
	var str = "SELECT A.*, B.`status` FROM `video` A LEFT JOIN `video_space` B ON A.`vid` = B.`vid`" +
		" WHERE A.`server_ip` = '" + CP.data.ip + "' AND B.`status` < 1 OR B.`status` IS NULL " +
		" ORDER BY `status` DESC LIMIT 3";

	connection.query(str, function (error, results, fields) {
		connection.end();
		if (error || !results.length) {
			cbk(false); CP.exit = 1;
		}
		cbk(results[0]);
	});
};
_f['get_vid']  = function(cbk) { 
	let vid = CP.data.db_video.vid, status = CP.data.db_video.status;
	if (status === null) {
		var connection = pkg.mysql.createConnection(config.db);
		connection.connect();
		var str = "INSERT INTO `video_space` (`vid`, `status`, `added`) VALUES " +
			" ('" + vid + "', 0, NOW()) ON DUPLICATE KEY UPDATE `status` = `status` ";

		connection.query(str, function (error, results, fields) {
			connection.end();
			cbk(vid);
		});
	} else {
		cbk(vid);
	}
};
_f['get_video_name']  = function(cbk) { 
	let vid = CP.data.get_vid, 
	    mnt_folder = '/mnt/shusiou-video/',
	    video_folder = mnt_folder + 'videos/',
	    _file = video_folder + vid + '/video/' + vid;

	pkg.fs.stat(_file, function(err, stat) {
		if (err) {
			pkg.exec('cp -f ' + video_folder + vid + '/video/video.mp4 ' +  _file, 					 
				function(err, stdout, stderr) {
					cbk(_file);
				});
		} else {
			cbk(_file);
		}
	});
};
CP.serial(
	_f,
	function(result) {
		console.log(result);
	},
	58000
);
