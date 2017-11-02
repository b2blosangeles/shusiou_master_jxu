var mnt_folder = '/mnt/shusiou-video/';
var fn = mnt_folder + 'videos/1/video/video.mp4';

pkg.fs.stat(fn, function(err, data) {
	if (err) {
		//      res.redirect('http://api.shusiou.com'+req.url);
		res.send('NO');
	} else {
		var readerStream = pkg.fs.createReadStream(fn);
		readerStream.pipe(res);
	}
});
