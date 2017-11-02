
if (!req.query['vid']) {
	res.send('vid error ');
	return true;
}
var mnt_folder = '/mnt/shusiou-video/';
var fn = mnt_folder + 'videos/'+req.query['vid']+'/video/video.mp4';

pkg.fs.stat(fn, function(err, data) {
	if (err) {
		res.send('NO');
	} else {
		var readerStream = pkg.fs.createReadStream(fn);
		readerStream.pipe(res);
	}
});
