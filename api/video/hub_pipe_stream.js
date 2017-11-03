
if (!req.query['fn']) {
	res.send('Error, Missing fn ');
	return true;
}
var mnt_folder = '/mnt/shusiou-video/';
var fn = mnt_folder + req.query['fn'];

pkg.fs.stat(fn, function(err, data) {
	if (err) {
		res.send('NO');
	} else {
		var readerStream = pkg.fs.createReadStream(fn);
		readerStream.pipe(res);
	}
});
