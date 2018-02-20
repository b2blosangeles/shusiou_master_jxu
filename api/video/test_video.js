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
					var file = pkg.fs.createReadStream('/var/img/niu.mp4');
					file.pipe(res);
					var t = new Date().getTime();
					var had_error = '';
					file.on('error', function(err){
						had_error = '1';
					});

					file.on('close', function(){ 									
					});	
					
					
				}
			}
		});
		break;			
	default:
		 write404('type error');  
}
