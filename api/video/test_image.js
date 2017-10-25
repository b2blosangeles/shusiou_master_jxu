var transformText = function(contents) {
	return contents.toString().replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '\\$&').
		replace(/[\n\r]/g, '\\n')
};

var vid = 'P1', w = req.query['w'] || 180;
var video_folder = '/mnt/shusiou-video/videos/';
file_video =  video_folder + vid + '/video/video.mp4';

var folder_image = '/tmp/images/'+ vid + '/';

var s=10, fn = '/tmp/images/' + vid + '/' + s + '_' + w + '.png' 
    
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
			
			if  (new Date().getTime() - env.ffmpeg  > 1000) env.ffmpeg = 0;
		
			//env._itv = setInterval(function() {
			//	if (!env.ffmpeg) {
					env.ffmpeg = new Date().getTime();
					/*
					var ls = childProcess.spawn('ffmpeg',
					['-ss', s, '-i', file_video, '-vf', 'scale=-1:' +  w, '-preset', 'ultrafast', fn, '-y']
					);
					*/
					var dd='==';
					
					var ls = childProcess.exec('ffmpeg -ss ' + s + ' -i ' + file_video + ' -vf scale=-1:' +  w + '  -preset ultrafast ' +  fn +' -y ', 
						function (error, stdout, stderr) {
						  cbk(transformText(stdout));		
						});
					/*
					ls.on('data', function(code) {
						env.ffmpeg = 0;
						dd += code;
						// clearInterval(env._itv);
						//setTimeout(cbk, 100);
					 });
		
					ls.on('close', function(code) {
						env.ffmpeg = 0;
						transformText(dd);
						// clearInterval(env._itv);
						//setTimeout(cbk, 100);
					 });
					ls.on('exit', function(code) {
						env.ffmpeg = 0;
						cbk(dd);
						// clearInterval(env._itv);
						//setTimeout(cbk, 100);	
					 });	
					ls.on('error', function(code) {
						env.ffmpeg = 0;
						cbk('env.ffmpegDD');
						// clearInterval(env._itv);
						//setTimeout(cbk, 100);						
					 });
					 */
			//	}	
		//	}, 50);
		
	//	}
	});
};

CP.serial(
	_f,
	function(data) {
		// res.send(data);
		
			res.writeHead(500, {'Content-Type': 'text/html'});
			res.write('output-> ' +JSON.stringify(data));
			res.end();					
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
