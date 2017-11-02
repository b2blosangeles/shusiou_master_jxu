if (!req.query['fn']) {
	res.send('fn error ');
	return true;
}
var mnt_folder = '/mnt/shusiou-video/';
var fn = mnt_folder + fn;

pkg.fs.stat(fn, function(err, data) {
	if (err) {
		res.send({status:'error', message:'File does not exist!'});
	} else {
		res.send({status:'success', size:data.size});
	}
});
