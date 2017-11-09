var type= req.query['type'], vid = req.query['vid'];
if (!type || !vid) { res.send('vid or type error '); return true; }

var mnt_folder = '/mnt/shusiou-video/',  
    video_folder = mnt_folder  + 'videos/' + vid + '/', 
    file_video =  video_folder + 'video/video.mp4',
    folder_image = video_folder + 'images/';
                    
var folderP = require(env.site_path + '/api/inc/folderP/folderP');

switch(type) {
	case 'image':
		var w = req.query['w'], s = req.query['s'];
		if (!s || [90|180, 480].indexOf(w) !== -1) {  res.send('wrong s or w'); return true; }
		var fn = folder_image + w + '_' + s + '.png';
		var CP = new pkg.crowdProcess();
		var _f = {};

		_f['I0'] = function(cbk) { /* --- check mnt exist --- */
			pkg.fs.stat(mnt_folder, function (err, stats){
			if (err) { cbk(false); CP.exit = 1;}
			else if (!stats.isDirectory()) {  cbk(false); CP.exit = 1; } else {
			      pkg.fs.stat(file_video, function(err, stat) {
				 if(!err) { cbk(true); } else {  cbk(err.message); CP.exit = 1; }
			      });
			}
			});
		};

		_f['S1'] = function(cbk) { 
			var fp = new folderP();
			fp.build(folder_image, function() {
			    cbk(true);
			});
		};

		_f['S2'] = function(cbk) {
			pkg.fs.stat(fn, function(err, stat) {
				if(!err) { cbk(fn);
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
						res.writeHead(404, {'Content-Type': 'text/html'});
						res.write(fn + ' does not exist');
						res.end();
					} else {
						res.writeHead(200); 
						var file = pkg.fs.createReadStream(fn);
						file.pipe(res);
					}
				});
			},
		6000
		);    
		break;
	default:
		res.send('type error');  
}
