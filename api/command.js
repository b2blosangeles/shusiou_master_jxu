if (!req.query['opt']) {
	res.send('Missing opt parpmeter error');
	return true;
}
switch(req.query['opt']) {
    case 'git_frame_pull':
	pkg.exec('cd ' + env.root_path + '&& git pull', function(error, stdout, stderr) {
		 res.send(stdout);
	});
        break;
    case 'git_site_pull':
	pkg.exec('cd ' + env.site_path + '&& git pull', function(error, stdout, stderr) {
		 res.send(stdout);
	});
        break;		
    default:
	res.send('Wrong opt parpmeter!!');
	return true;
}
