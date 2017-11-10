function write404(msg) {
	res.writeHead(404);
	res.write(msg);
	res.end();	
}

var type= req.query['type'], vid = req.query['vid'];
if (!type || !vid) {  write404('vid or type error '); return true; }

var mnt_folder = '/mnt/shusiou-video/',  
    video_folder = mnt_folder  + 'videos/' + vid + '/', 
    file_video =  video_folder + 'video/video.mp4',
    folder_image = video_folder + 'images/',
    folder_section =   video_folder + 'sections/';

var folderP = require(env.site_path + '/api/inc/folderP/folderP');
var cache_only = (req.query['cache_only'])?true:false;

function master_node_log (file, type, url) {
	var mysql = require(env.site_path + '/api/inc/mysql/node_modules/mysql'),
	cfg0 = require(env.site_path + '/api/cfg/db.json');					
	var connection = mysql.createConnection(cfg0);
	var inserted_id = '';
	var str = "INSERT INTO `master_node_log` (`type`, `url`, `started`) VALUES "+    
		 " ('" + type + "', '" + url + "', NOW()) ";
	connection.query(str, function (error, results, fields) {
		inserted_id = JSON.stringify(results.insertId);
	}); 

	var had_error = '';
	file.on('error', function(err){
		had_error = 1;
	});

	file.on('close', function(){
		connection.connect();
		var str = "UPDATE `master_node_log` SET `finished` = NOW(), `is_error` = '" + had_error + "' "+
		    "WHERE `id` = '" + inserted_id + "' ";
		connection.query(str, function (error, results, fields) {
			connection.end();
		}); 						
	});	
}

switch(type) {
	case 'image':
		var w = req.query['w'], s = req.query['s'];
		if (!s || ['90', '180', '480', 'FULL'].indexOf(w) === -1) { write404('wrong s or w'); return true; }
		var fn = folder_image + w + '_' + s + '.png';

		var CP = new pkg.crowdProcess();
		var _f = {};

		_f['S0'] = function(cbk) { 
			pkg.fs.stat(mnt_folder, function (err, stats){
				if (err) { cbk({status:'failure', message:err.message});  CP.exit = 1; }
				else if (!stats.isDirectory()){ cbk({status:'failure', message:err.message});  CP.exit = 1; }
				else {
				      pkg.fs.stat(file_video, function(err, stat) {
					 if(err) { cbk({status:'failure', message:err.message});  CP.exit = 1; }
					 else cbk(true);
				      });
				}
			});
		};		
		
		_f['S1'] = function(cbk) { 
			var fp = new folderP();
			fp.build(folder_image, function() { cbk(true);});
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
				if (CP.data.S0 !== true) {
					res.send('CP.data.S0');
					return true;
				}
				
				pkg.fs.stat(fn, function(err, data1) {
					if (err) {  write404(fn + ' does not exist'); }
					else {
						res.writeHead(200); 
						var file = pkg.fs.createReadStream(fn);
						file.pipe(res);
						setTimeout(
							function() {
								file.destroy();
								write404('timeout')
							}, 30000
						);						
					}
				});
			},
			30000
		);    
		break;
	case 'section':
		var l = req.query['l'], s = req.query['s'];
		if (!s || !l) { write404('wrong s or l'); return true; }
		var fn = folder_section + s + '_' + l + '.mp4';

		var CP = new pkg.crowdProcess();
		var _f = {};
		
		_f['S0'] = function(cbk) { 
			pkg.fs.stat(mnt_folder, function (err, stats){
				if (err) { cbk({status:'failure', message:err.message});  CP.exit = 1; }
				else if (!stats.isDirectory()){ cbk({status:'failure', message:err.message});  CP.exit = 1; }
				else {
				      pkg.fs.stat(file_video, function(err, stat) {
					 if(err) { cbk({status:'failure', message:err.message});  CP.exit = 1; }
					 else cbk(true);
				      });
				}
			});
		};		
		
		_f['S1'] = function(cbk) { 
			var fp = new folderP();
			fp.build(folder_section, function() { cbk(true);});
		};

		_f['S2'] = function(cbk) {

			pkg.fs.stat(fn, function(err, stat) {
				if(!err) { cbk(fn);
				} else {
					var childProcess = require('child_process');
					var ls = childProcess.exec('ffmpeg  -i ' + file_video + ' -ss '+ s + ' -t ' + l + ' -c copy ' + fn +' -y ', 		   
						function (error, stdout, stderr) {
							cbk(true);
						});
				}
			});
		};
		CP.serial(
			_f,
			function(data) {
				if (CP.data.S0 !== true) {
					res.send(CP.data.S0);
					return true;
				}				
				pkg.fs.stat(fn, function(err, data1) {
					if (err) {  write404(fn + ' does not exist'); }
					else {
						if (cache_only)	{
							var file = pkg.fs.createReadStream(fn);
							file.pipe(res);
						} else {
							var total = data1.size;
							var range = req.headers.range;
							if (range) {
								var parts = range.replace(/bytes=/, "").split("-");
								var partialstart = parts[0]; var partialend;
								  partialend =  parts[1];
								var start = parseInt(partialstart, 10);
								var end = partialend ? parseInt(partialend, 10) : total-1;
								var chunksize = (end-start)+1;
								var file = pkg.fs.createReadStream(fn, {start:start, end:end});
								res.writeHead(206, {'Content-Range': 'bytes ' + start + '-' + end + '/' + total, 
									'Accept-Ranges': 'bytes', 'Content-Length': chunksize, 'Content-Type': 'video/mp4' });
							       file.pipe(res);
							} else {
								res.send('Need streaming player');
							}
						}	
					}
				});
			},
			30000
		);    
		break;	
	case 'video':				
		pkg.fs.stat(file_video, function(err, data1) {
			if (err) {  write404(file_video + ' does not exist'); }
			else {
				if (cache_only)	{
					var file = pkg.fs.createReadStream(file_video);
					master_node_log(file, 'video', req.url);
					file.pipe(res);
				} else {				
					var total = data1.size;
					var range = req.headers.range;
					if (range) {
						var parts = range.replace(/bytes=/, "").split("-");
						var partialstart = parts[0]; var partialend;
						  partialend =  parts[1];
						var start = parseInt(partialstart, 10);
						var end = partialend ? parseInt(partialend, 10) : total-1;
						var chunksize = (end-start)+1;
						var file = pkg.fs.createReadStream(file_video, {start:start, end:end});
						res.writeHead(206, {'Content-Range': 'bytes ' + start + '-' + end + '/' + total, 
							'Accept-Ranges': 'bytes', 'Content-Length': chunksize, 'Content-Type': 'video/mp4' });
					       file.pipe(res);
					} else {
						res.send('Need streaming player');
					}
				}
			}
		});
		break;			
	default:
		 write404('type error');  
}
