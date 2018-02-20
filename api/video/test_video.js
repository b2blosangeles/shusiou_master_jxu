function write404(msg) {
	res.writeHead(404);
	res.write(msg);
	res.end();	
}


var mnt_folder = '/mnt/shusiou-video/';

var config = require(env.config_path + '/config.json');

var folderP = require(env.site_path + '/api/inc/folderP/folderP');

		var file = pkg.fs.createReadStream('/var/img/niu.mp4');
		file.pipe(res);
		var t = new Date().getTime();
		var had_error = '';
		file.on('error', function(err){
			had_error = '1';
		});

		file.on('close', function(){ 									
		});	

