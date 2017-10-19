var exec = require('child_process').exec;
var path = require('path');
var env = {root_space:path.join(__dirname, '../../')};

var LOG = require(env.root_space + 'package/log/log.js');
var log = new LOG();

var cmd = 'cd ' + env.root_space + 'site && git pull';
exec(cmd, function(error, stdout, stderr) {
    if (error) {
		log.write("/var/log/shusiou_cron.log", 'cron::'+cmd,  JSON.stringify(error));
	} else {
        	log.write("/var/log/cron_git.log", 'git cron :: ' + cmd, stdout); 
    	}
});
