if (!req.query['opt']) {
	res.send('Missing opt parpmeter error');
	return true;
}
pkg.exec('cd ' + env.root_path + '&& git pull', function(error, stdout, stderr) {
	 res.send(stdout);
});
