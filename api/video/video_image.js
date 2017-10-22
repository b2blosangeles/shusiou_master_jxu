var video_folder = '/var/video/';
var vid = 1;
file_video =  video_folder + vid + '.mp4';

var folder_image = '/tmp/images/ '+ vid;

if (!req.query['s']) {
	res.send('S error');
	return true;
}
var s=req.query['s'], fn = '/tmp/images/' + vid + '/' + s + '.png'; 
    
var CP = new pkg.crowdProcess();

var _f = {};
_f['S0'] = function(cbk) {
	pkg.fs.stat(file_video, function(err, stat) {
		 if(!err) {
			cbk(true);
		 } else {
			cbk(err.message);
			CP.exit = 1;
		}
	});	
};

_f['S1'] = function(cbk) {
	var folderP = require(env.site_path + '/api/inc/folderP/folderP');
	var fp = new folderP();
	fp.build(folder_image, function() {
		cbk(true);
	});
};

_f['S2'] = function(cbk) {
	pkg.fs.stat(fn, function(err, stat) {
		 if(!err) {
			cbk(fn);
		 } else {
		 
			var childProcess = require('child_process');
			var ls = childProcess.exec('ffmpeg -ss ' + s + ' -i ' + file_video + ' -vf scale=-1:360  -preset ultrafast ' +  fn +' -y ', 		   
				function (error, stdout, stderr) {
					cbk(true);
				});

		}
	});
};

CP.serial(
	_f,
	function(data) {			
		pkg.fs.stat(fn, function(err, data1) {
		      if (err) {
			      res.send(fn + ' does not exist');
		      } else {
				var file = pkg.fs.createReadStream(fn);
				file.pipe(res);		      
			}
		});
	},
	6000
);
