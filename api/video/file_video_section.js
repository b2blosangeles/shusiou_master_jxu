var vid = req.query['vid'];
var mnt_folder = '/mnt/shusiou-video/';
var c_folder =   mnt_folder + 'videos/' + vid + '/sections/';
var s = 0, l =  0;
var video_folder = mnt_folder + 'videos/' + vid + '/video/';

if (req.query['s']) {
	s = req.query['s']
}

if (req.query['l']) {
	l = req.query['l']
}

var s_file =  video_folder + 'video.mp4';
var fn = c_folder + s + '_' + l + '.mp4';


var childProcess = require('child_process');
var CP = new pkg.crowdProcess();
var _f = {};

_f['I0'] = function(cbk) { /* --- check mnt exist --- */
	pkg.fs.stat(mnt_folder, function (err, stats){
		if (err) { cbk(false); CP.exit = 1;}
		else if (!stats.isDirectory()) {
			cbk(false); CP.exit = 1;
		} else {
			cbk(true);
		}
	});
};

_f['S0'] = function(cbk) {
	var folderP = require(env.site_path + '/api/inc/folderP/folderP');
	var fp = new folderP();
	fp.build(c_folder, function() {
		cbk(c_folder);	
	});
	
};
		
_f['S1'] = function(cbk) {
	pkg.fs.stat(fn, function(err, stat) {
		if (err) {
			var ls = childProcess.exec('ffmpeg  -i ' + s_file + ' -ss '+ s + ' -t ' + l + ' -c copy ' + fn +' -y ', 		   
				function (error, stdout, stderr) {
					cbk(true);
				});
		} else {
			cbk(true);
		}
	});
}

CP.serial(
	_f,
	function(data) {
		pkg.fs.stat(fn, function(err, data) {
		    if (err) {
			res.writeHead(404, {'Content-Type': 'text/html'});
			res.write('it does not exist');
			res.end();
		    } else {
			var file = pkg.fs.createReadStream(fn);
			file.pipe(res);
			}
		});
	},
	30000
);
