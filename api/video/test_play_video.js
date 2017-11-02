var request = require(env.root_path + '/package/request/node_modules/request');
var file = pkg.fs.createWriteStream('/tmp/video_a.mp4');

var request = http.get('http://api.shusiou.com/api/pipe_stream.js?fn='+cg[i], function(response) {
	response.pipe(file);
	response.on('end', function() {
		cbk('pulled ' + cg[i] + ' at: ' + (new Date().getTime() - tm) + ' ms');	

		writeRepLog('pulled::'+cg[i], function() {  
		});

	});
});
