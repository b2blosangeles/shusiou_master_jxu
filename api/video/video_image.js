
var vid = req.query['vid'], 
    w = req.query['w'] || 180,
    video_folder = '/var/videos/' + vid + '/',
    file_video =  video_folder + 'video/video.mp4';

var folder_image = video_folder + 'images/';

if (!req.query['s']) {
	res.send('S error');
	return true;
}
var s=req.query['s'], fn = folder_image + w + '_' + s + '.png'; 
    
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
			if (w != 'FULL') s = 'ffmpeg -ss ' + s + ' -i ' + file_video +' -vf scale=-1:' +  w + '  -preset ultrafast ' + fn + ' -y ';
			else s = 'ffmpeg -ss ' + s + ' -i ' + file_video +' -vframes 1 ' +  fn + ' -y ';
			var childProcess = require('child_process');
			var ls = childProcess.exec(s, 		   
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
