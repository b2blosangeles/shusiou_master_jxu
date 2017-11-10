var path = require('path'), env = {root_path:path.join(__dirname, '../..')};
env.site_path = env.root_path + '/site';
var mnt_folder = '/mnt/shusiou-video/';
var video_folder = mnt_folder + 'videos/';

var 	ytdl = require(env.site_path + '/api/inc/ytdl-core/node_modules/ytdl-core'),
	mysql = require(env.site_path + '/api/inc/mysql/node_modules/mysql'),
    	crowdProcess =  require(env.root_path + '/package/crowdProcess/crowdProcess'),
    	fs = require('fs'),
    	folderP = require(env.site_path + '/api/inc/folderP/folderP'),
    	cfg0 = require(env.site_path + '/api/cfg/db.json'),
    	fp = new folderP();

function getServerIP() {
    var ifaces = require('os').networkInterfaces(), address=[];
    for (var dev in ifaces) {
        var v =  ifaces[dev].filter((details) => details.family === 'IPv4' && details.internal === false);
        for (var i=0; i < v.length; i++) address[address.length] = v[i].address;
    }
    return address;
};
var ips = getServerIP();
var CP = new crowdProcess(), _f = {};

_f['P0'] = function(cbk) { /* --- get server IP --- */
    fs.readFile('/var/.qalet_whoami.data', 'utf8', function(err,data) {
	if ((data) && ips.indexOf(data) != -1)  cbk(data);
	else { cbk(false); CP.exit = 1; }
    });	 
};

_f['I0'] = function(cbk) { /* --- check mnt exist --- */
	fs.stat(mnt_folder, function (err, stats){
		if (err) { cbk(false); CP.exit = 1;}
		else if (!stats.isDirectory()) {
			cbk(false); CP.exit = 1;
		} else {
			cbk(true);
		}
	});
};
_f['CL1'] = function(cbk) {
	var connection = mysql.createConnection(cfg0);
	connection.connect();
	var message = '';
	var str = 'INSERT INTO `download_failure` ' +
	    '(`id`, `source`, `code`, `video_info`, `message`) '+
	    'SELECT `id`, `source`, `code`, `info`, "Over 1 minute time limutation" FROM `download_queue` '+
	    ' WHERE `status` = 9';
	
	connection.query(str, function (error, results, fields) {
		connection.end();
		if (error) {
			cbk(false);
		} else {
			if (results.affectedRows) {
				cbk(results);
			} else {
				cbk(false);
			}

		}
	});  
};	
_f['CL2'] = function(cbk) { /* --- clean overtime --- */
	var connection = mysql.createConnection(cfg0);
	connection.connect();
	var str = 'DELETE FROM `download_queue` WHERE `status` = 9';
	connection.query(str, function (error, results, fields) {
		connection.end(); cbk(false);
	});  
};
_f['I1'] = function(cbk) { /* --- mark overtime --- */
	var connection = mysql.createConnection(cfg0);
	connection.connect();
	var str = 'UPDATE `download_queue` SET `status` = 9 WHERE `holder_ip` = "' +  CP.data.P0 + '" AND `status` = 1';
	connection.query(str, function (error, results, fields) {
		connection.end(); cbk(false);
	});  
};

_f['P1'] = function(cbk) { /* --- pickup one from queue --- */
	var connection = mysql.createConnection(cfg0);
	connection.connect();
	var str = 'UPDATE  download_queue SET `holder_ip` = "' + CP.data.P0 + '", `status` = 1, '+
	    	' `video_code` = `id` * 1000000000000  + ' + (Math.floor(new Date().getTime() * 0.001)) + ', hold_time = NOW() ' + 
		' WHERE  `status` = 0 AND (`holder_ip` = "" OR `holder_ip` IS NULL) ORDER BY `created` ASC LIMIT 1';
	
	connection.query(str, function (error, results, fields) {
		connection.end();
		if ((results) && (results.affectedRows)) {
			cbk(results.affectedRows);
		} else {
			cbk(false); CP.exit = 1;
		}
	});  
};
_f['P2'] = function(cbk) { /* --- get the one from queue --- */
	var connection = mysql.createConnection(cfg0);
	connection.connect();
	var str = 'SELECT * FROM `download_queue` WHERE `holder_ip` = "' + CP.data.P0 + '" AND `status` = 1';
	connection.query(str, function (error, results, fields) {
		connection.end();
		if (results.length) {
			cbk(results[0]);
		} else {
			cbk(false); CP.exit = 1;
		}
	});  
};

_f['DR1'] = function(cbk) { /* create video path */
	fp.build(video_folder + CP.data.P2.video_vode + '/video/', function() {
		cbk(video_folder + CP.data.P2.id + '/video/');
	});
};
_f['DR2'] = function(cbk) { /* create miange path */
	fp.build(video_folder + CP.data.P2.video_vode + '/images/' , function() {
		cbk(video_folder + CP.data.P2.video_vode + '/images/');
	});
};

_f['DR3'] = function(cbk) { /* create sections path */
	fp.build(video_folder + CP.data.P2.id + '/sections/' , function() {
		cbk(video_folder + CP.data.P2.video_vode + '/sections/');
	});
};

_f['D0'] = function(cbk) {  /* downlod video */
	if ((CP.data.P2) && (CP.data.P2.code)) {
		var url = decodeURIComponent(CP.data.P2.code);
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
		CP.exit = 1; cbk(false);
	}	
};

_f['D1'] = function(cbk) {
	if (!CP.data.D0 || !CP.data.P2.code || CP.data.D0 != CP.data.P2.code) {
		cbk(false); CP.exit = 1;
	}
		
	var childProcess = require('child_process');
	var file_video = CP.data.DR1 +'video.mp4';
	var AD = {start:30, length:30};
	var fn = CP.data.DR3 + AD.start + '_' + AD.length + '.mp4';
	s = 'ffmpeg -i ' + file_video + ' -ss '+ AD.start + '  -t ' + AD.length + ' -c copy ' + fn + ' -y ';
	var ls = childProcess.exec(s, 
		function (error, stdout, stderr) {
			fs.stat(fn, function(err, stat) {
			  if(err) {
				cbk(false); 
				  
			  } else {
				  if (!stat.size) {
					 cbk(false); 
				  } else {
			  		cbk(stat.size);
				  }	  
			  }			  
			});	
		});	
};

_f['D2'] = function(cbk) {
	if (!CP.data.D0 || !CP.data.P2.code || CP.data.D0 != CP.data.P2.code) {
		cbk(false); CP.exit = 1;
	}
	
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


_f['E1'] = function(cbk) {
	var connection = mysql.createConnection(cfg0);
	connection.connect();
	var info = (CP.data.P2.info)?CP.data.P2.info:'';
	var json_info = {};
	try { json_info = JSON.parse(info); } catch (e) {}
	if (CP.data.D1) {
		var str = 'INSERT INTO `video` ' +
		    '(`source`, `code`, `server_ip`, `video_info`, `vid`, `video_length`, `org_thumbnail`, `uploaded`) VALUES (' +
		    "'" + CP.data.P2.source + "'," +
		    "'" + CP.data.P2.code.replace(/\'/g, "\\\'") + "'," +
		    "'" + CP.data.P2.holder_ip + "'," +
		    "'" + info.replace(/\'/g, "\\\'") + "'," +
		    "'" + CP.data.P2.video_code + "'," +
		    "'" +  CP.data.P2.video_length + "'," +
		    "'" +  CP.data.P2.org_thumbnail + "'," +
		    'NOW())';
	} else {
		var message = '';
		if (!CP.data.D1) message = 'Wrong video format!'

		var str = 'INSERT INTO `download_failure` ' +
		    '(`id`,`source`, `code`, `video_info`, `message`) VALUES (' +
		    "'" + CP.data.P2.id + "'," +
		    "'" + CP.data.P2.source + "'," +
		    "'" + CP.data.P2.code.replace(/\'/g, "\\\'") + "'," +
		    "'" + info.replace(/\'/g, "\\\'") + "'," +
		    "'" + message.replace(/\'/g, "\\\'") + "')";
	
	}
	connection.query(str, function (error, results, fields) {
		connection.end();
		if (error) {
			cbk(str);
		} else {
			if (results.affectedRows) {
				cbk(true);
			} else {
				cbk(false);
			}

		}
	});  
};
_f['E2'] = function(cbk) {
	
	var connection = mysql.createConnection(cfg0);
	connection.connect();
	var str = 'DELETE FROM `download_queue`  WHERE `id` = "' + CP.data.P2.id + '"';
	connection.query(str, function (error, results, fields) {
		connection.end();
		cbk(true);
	});  
};
	
CP.serial(
	_f,
	function(data) {
		process.stdout.write(JSON.stringify({_spent_time:data._spent_time, status:data.status, data:data}));
	},
	58000
);
