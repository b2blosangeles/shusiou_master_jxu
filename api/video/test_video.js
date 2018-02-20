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

var config = require(env.config_path + '/config.json');

var folderP = require(env.site_path + '/api/inc/folderP/folderP');
var cache_only = (req.query['cache_only'])?true:false;

switch(type) {
	case 'video':				
		pkg.fs.stat(file_video, function(err, data1) {
			if (err) {  write404(file_video + ' does not exist'); }
			else {
				if (cache_only)	{
					var file = pkg.fs.createReadStream(file_video);
					file.pipe(res);
					var t = new Date().getTime();
					var mysql = require(env.site_path + '/api/inc/mysql/node_modules/mysql'),
					cfg0 =  config.db;	
					var had_error = '';
					file.on('error', function(err){
						had_error = '1';
					});

					file.on('close', function(){
						var connection = mysql.createConnection(cfg0);
						connection.connect();
						var running_time = new Date().getTime() - t;
						var str = "INSERT INTO `master_node_log` (`type`, `url`, `is_error`, `running_time`, `finished`) VALUES "+    
						 " ('" + 'video' + "', '" + req.url + "', '" + had_error + "', '" + running_time + "', NOW()) ";
						connection.query(str, function (error, results, fields) {
							connection.end();	
						}); 									
					});	
					
					
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
