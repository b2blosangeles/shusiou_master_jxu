var path = require('path');
var env = {root_path:path.join(__dirname, '../..')};
env.site_path = env.root_path + '/site';

var ytdl = require(env.site_path + '/api/inc/ytdl-core/node_modules/ytdl-core');
var mysql = require(env.site_path + '/api/inc/mysql/node_modules/mysql');
var cfg0 = require(env.site_path + '/api/cfg/db.json');
var crowdProcess =  require(env.root_path + '/package/crowdProcess/crowdProcess');
var fs = require('fs');
			    
var video_folder = '/var/videos/';

function getServerIP() {
    var ifaces = require('os').networkInterfaces(), address=[];
    for (var dev in ifaces) {
        var v =  ifaces[dev].filter((details) => details.family === 'IPv4' && details.internal === false);
        for (var i=0; i < v.length; i++) address[address.length] = v[i].address;
    }
    return address;
};

var holder_ip = getServerIP();

var CP = new crowdProcess();
var _f = {};
/*
_f['S0'] = function(cbk) {
	var folderP = require(env.site_path + '/api/inc/folderP/folderP');
	var fp = new folderP();
	fp.build(video_folder+'video/', function() {
		cbk(true);
	});
};
*/

_f['P0'] = function(cbk) {
	var connection = mysql.createConnection(cfg0);
	connection.connect();
	var str = 'UPDATE `download_queue` SET `status` = 9 WHERE `holder_ip` = "' + holder_ip + '" AND `status` = 1';
	connection.query(str, function (error, results, fields) {
		connection.end();
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
_f['P1'] = function(cbk) {
	var connection = mysql.createConnection(cfg0);
	connection.connect();
	var str = 'UPDATE  download_queue SET `holder_ip` = "' + holder_ip + '", `status` = 1, hold_time = NOW() ' + 
		' WHERE  `status` = 0 AND `holder_ip` = "" OR `holder_ip` IS NULL ORDER BY `created` ASC LIMIT 1';
	
	connection.query(str, function (error, results, fields) {
		connection.end();
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
_f['P2'] = function(cbk) {
	var connection = mysql.createConnection(cfg0);
	connection.connect();
	var str = 'SELECT * FROM `download_queue` WHERE `holder_ip` = "' + holder_ip + '" AND `status` = 1';
	connection.query(str, function (error, results, fields) {
		connection.end();
		if (error) {
			cbk(false);
			CP.exit = 1;
		} else {
			if (results.length) {
				cbk(results[0]);
			} else {
				cbk(false);
				CP.exit = 1;
			}

		}
	});  
};

_f['DR1'] = function(cbk) {
	var folderP = require(env.site_path + '/api/inc/folderP/folderP');
	var fp = new folderP();
	fp.build(video_folder + CP.data.P2.id + '/video/', function() {
		cbk(video_folder + CP.data.P2.id + '/video/');
	});
};
_f['DR2'] = function(cbk) {
	var folderP = require(env.site_path + '/api/inc/folderP/folderP');
	var fp = new folderP();
	fp.build(video_folder + CP.data.P2.id + '/images/' , function() {
		cbk(video_folder + CP.data.P2.id + '/images/');
	});
};

_f['DR3'] = function(cbk) {
	var folderP = require(env.site_path + '/api/inc/folderP/folderP');
	var fp = new folderP();
	fp.build(video_folder + CP.data.P2.id + '/sections/' , function() {
		cbk(video_folder + CP.data.P2.id + '/sections/');
	});
};

_f['D0'] = function(cbk) {
	if ((CP.data.P2) && (CP.data.P2.code)) {
		var url = decodeURIComponent(CP.data.P2.code);
		// var url = CP.data.P2.code;
	//	var video = ytdl(url, {quality:'18'}, function(err) {});
		var video = ytdl(url, {quality:'highest'}, function(err) { });
		video.pipe(fs.createWriteStream(CP.data.DR1 +'video.mp4'));	
		video.on('data', function(info) {
		}); 

		video.on('end', function(info) {
			cbk(CP.data.P2.code);
		});
		
		video.on('error', function(info) {
			CP.exit = 1;
			cbk('ERRCP.data.P2.code');
		});		
		
	} else {
		CP.exit = 1;
		cbk(false);
	}	
};
/*
_f['D1'] = function(cbk) {
	var childProcess = require('child_process');
	var file_video = CP.data.DR1 +'video.mp4';
	
	var s = 'ffmpeg ';
	var I = [1, 10, 30, 60, 90, 180, 300], W = ['', 90, 180, 480];
	for (var i = 0; i < I.length; i++) {
		s+= ' -ss ' + I[i] + ' -i ' + file_video;
		for (j = 0; j < W.length; j++) {
			if (W[j]) s += ' -vf scale=-1:' +  W[j] + '  -preset ultrafast ' +  CP.data.DR2 + W[j] + '_' + I[i] + '.png ';
			else s += ' -vframes 1 ' +  CP.data.DR2 +'FULL_' + I[i] + '.png ';
		}
	}
	s += ' -y ;'
	var ls = childProcess.exec(s, 
		function (error, stdout, stderr) {
		  cbk('=niu=');		
		});	
};
*/
_f['D2'] = function(cbk) {
	var childProcess = require('child_process');
	var file_video = CP.data.DR1 +'video.mp4';
	var AD = {s:150, t:300};
	var fn = CP.data.DR3 + AD.s + '_' + AD.t + '.mp4';
	s = 'ffmpeg -i ' + file_video + ' -ss '+ AD.s + '  -t ' + AD.t + ' -c copy ' + fn + ' -y ';
	var ls = childProcess.exec(s, 
		function (error, stdout, stderr) {
			fs.stat(fn, function(err, stat) {
			  if(err) {
			    cbk(false); 
			  } else {
			  	cbk(stat.size);
			  }			  
			});	
		});	
};

/*
_f['D1'] = function(cbk) {
	var childProcess = require('child_process');
	var file_video = CP.data.DR1 +'video.mp4', w = 180, s = 10, f_n = CP.data.DR2 + w + '_' + s + '_.png';
	var ls = childProcess.exec('ffmpeg -ss ' + s + ' -i ' + file_video + ' -vf scale=-1:' +  w + '  -preset ultrafast ' +  f_n +' -y ;"', 
		function (error, stdout, stderr) {
		  cbk('=niu=');		
		});	
};

_f['D2'] = function(cbk) {
	var childProcess = require('child_process');
	var file_video = CP.data.DR1 +'video.mp4', w = 90, s = 10, f_n = CP.data.DR2 + w + '_' + s + '_.png';
	var ls = childProcess.exec('ffmpeg -ss ' + s + ' -i ' + file_video + ' -vf scale=-1:' +  w + '  -preset ultrafast ' +  f_n +' -y ;', 
		function (error, stdout, stderr) {
		  cbk('=niu=');		
		});	
};
*/
_f['E1'] = function(cbk) {
	var connection = mysql.createConnection(cfg0);
	connection.connect();
	var status = (CP.data.D2)?8:9;
	var str = 'UPDATE `download_queue` SET `status` = "' + status + '" WHERE `id` = "' + CP.data.P2.id + '"';
	connection.query(str, function (error, results, fields) {
		connection.end();
		if (error) {
			cbk(false);
		} else {
			if (results.affectedRows) {
				cbk('OK');
			} else {
				cbk(false);
			}

		}
	});  
};
CP.serial(
	_f,
	function(data) {
		process.stdout.write(JSON.stringify({_spent_time:data._spent_time, status:data.status, data:data}));
	},
	59000
);

