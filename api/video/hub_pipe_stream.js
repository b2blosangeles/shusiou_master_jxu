
if (!req.query['fn']) {
	res.send('Error, Missing fn ');
	return true;
}
var mnt_folder = '/mnt/shusiou-video/';
var fn = mnt_folder + req.query['fn'];

pkg.fs.stat(fn, function(err, data) {
	if ((err) || data.size < 1024) {
		res.writeHead(404);
		res.write(fn.replace(new RegExp('^'+mnt_folder,'i'),'==') + ' does not exist or size is too small');
		res.end();
	} else {
		res.writeHead(200); 
		var readerStream = pkg.fs.createReadStream(fn);
		readerStream.pipe(res);
	}
});
