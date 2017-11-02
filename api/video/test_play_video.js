var request = require(env.root_path + '/package/request/node_modules/request');
var file = pkg.fs.createWriteStream('/tmp/video_a.mp4');

var request = http.get('http://shusiou.com/api/video/pipe_stream.js?fn='+cg[i], function(response) {
	response.pipe(file);
	response.on('end', function() {
		res.send('pulled ' + cg[i] + ' at: ' + (new Date().getTime() - tm) + ' ms');	
	});
});
