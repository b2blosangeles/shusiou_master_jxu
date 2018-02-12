
let opt = req.body['opt'] || req.param('opt');
if (!opt) {
	res.send('Missing opt!!');
	return true;
}
switch(opt) {
		
    case 'git_frame_pull':
	pkg.exec('cd ' + env.root_path + '&& git pull', function(error, stdout, stderr) {
		if (error) res.send('error');
		else if (stdout) res.send(stdout);
		else res.send('stderr');
	});
        break;
		
    case 'git_site_pull':
	pkg.exec('cd ' + env.site_path + '&& git pull', function(error, stdout, stderr) {
		 res.send(stdout);
	});
        break;	
    case 'git_all_pull':
	pkg.fs.exists('/var/cert/', function(exists) {
		let cmd_plus = (exists)?' && cd /var/cert && git pull ':'';
		var cmd = 'cd ' + env.site_path + '&& git pull && cd ' + env.site_contents_path + '&& git pull && cd ' + env.root_path + '&& git pull' + cmd_plus; 	
		pkg.exec(cmd, function(error, stdout, stderr) {
			 res.send(out);
		});
	});
        break;					
		
    case 'reboot':	 
	pkg.exec('shutdown -r +1', function(error, stdout, stderr) {
	 	res.send('Server will be reboot in 1 minute!');
	});
	break;
		
    default:
	res.send('Wrong opt parpmeter!!');
	return true;
}
