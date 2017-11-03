
if (!req.query['fn']) {
	res.send('Error, Missing fn ');
	return true;
}
var mnt_folder = '/mnt/shusiou-video/';
var fn = mnt_folder + req.query['fn'];

pkg.fs.stat(fn, function(err, data) {
	if (err) {
		res.writeHead(404, {'Content-Type': 'text/html'});
		res.write(fn + ' does not exist');
		res.end();
	} else {
		res.writeHead(200); 
		var readerStream = pkg.fs.createReadStream(fn);
		readerStream.pipe(res);
	}
});
