
var vid = req.query['vid'], w = req.query['w'] || 180;
var video_folder = '/mnt/shusiou-video/videos/';
file_video =  video_folder + vid + '/video/video.mp4';

var folder_image = '/tmp/images/'+ vid + '/';

if (!req.query['s']) {
	res.send('S error');
	return true;
}
var s=req.query['s'], fn = '/tmp/images/' + vid + '/' + s + '_' + w + '.png' 
    
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
		//if(!err) {
		//	cbk(fn);
		// } else {
		 
			var childProcess = require('child_process');
		/*
			var _itv = setInterval(function() {
				if (!env.ffmpeg) {
					env.ffmpeg = fn;
					env.ffmpeg_t = new Date().getTime();
		*/			
		
					var ls = childProcess.spawn('ffmpeg',
					['-ss', s, '-i', file_video, '-vf', 'scale=-1:' +  w, '-preset', 'ultrafast', fn, '-y']
					);
					
					/*
					var ls = childProcess.exec('ffmpeg -ss ' + s + ' -i ' + file_video + ' -vf scale=-1:' +  w + '  -preset ultrafast ' +  fn +' -y ', 
						function (error, stdout, stderr) {
						  cbk('env.ffmpegAA');		
						});
					*/
		var qq = [];
					ls.on('close', function(code) {
					//	cbk('env.ffmpegB-B');
						/*
						pkg.fs.stat(fn, function(err, stat) {
							 if(!err) {
							//	env.ffmpeg = 0;
								cbk('env.ffmpegB-B');
							 } else {
								
								
							}
						});
						*/
						// cbk('niu');
						
						qq[qq.length] = 'niu';
					 });
					ls.on('exit', function(code) {
						qq[qq.length] = 'exit';
					 });	
					ls.on('error', function(code) {
						qq[qq.length] = 'error';
					 });	
					ls.on('close', function(code) {
						qq[qq.length] = 'close';
					 });	
				setTimeout(
					function() {
						cbk(qq);
					},2000
				);
		
		
			/*		
				}
				pkg.fs.stat(fn, function(err, stat) {
					 if(!err) {
						 if (env.ffmpeg == fn) {
							env.ffmpeg = 0;	 
							 env.ffmpeg_t = 0;
						 }		 
						
					 } else {
						
						if ((env.ffmpeg_t) && new Date().getTime() - env.ffmpeg_t > 1000) {
							env.ffmpeg = 0;	 
							env.ffmpeg_t = 0;
							clearInterval(_itv);
						}
						
					}
				});
				
			}, 50)
		*/
		// }
	});
};

CP.serial(
	_f,
	function(data) {
		res.send(data);
		return true;
		pkg.fs.stat(fn, function(err, data1) {
			
		      if (err) {
			      res.send(fn + ' does not exist');
		      } else {
				var file = pkg.fs.createReadStream(fn);
				file.pipe(res);	
			//      res.sendFile(fn);
			}
		});
	},
	10000
);
