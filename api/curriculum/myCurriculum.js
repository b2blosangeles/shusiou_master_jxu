var app = function(auth_data) { 
	var mysql = require(env.site_path + '/api/inc/mysql/node_modules/mysql'),
	    config = require(env.config_path + '/config.json'),
	    cfg0 = config.db;
	
	var opt = req.query['opt'];
	var uid = auth_data.uid;
	
	var connection = mysql.createConnection(cfg0);	
	
	switch(opt) {
		case 'add':
				/*
				connection.query(str, function (error, results, fields) {
					if (results.insertId) {
						var vid = results.insertId * 1000000000000 + Math.floor(new Date().getTime() * 0.001);
						var str1 = 'UPDATE `download_queue` SET `vid` = "' + vid + '" WHERE `id` = "' + results.insertId + '"';
						connection.query(str1, function (error1, results1, fields1) {
							connection.end();
							cbk(vid);
						});	

					} else cbk(false);
				});  
				*/
			var str = 'INSERT INTO  curriculums (`uid`,`vid`,`name`,`mother_lang`,`learning_lang`,`level`, `created`) '+
			' VALUES (' +
			'"' + req.body.auth.uid + '",' +
			'"' + req.body.vid + '",' +
			'"' + req.body.name + '",' +
			'"' + req.body.mother_lang  + '",' +
			'"' + req.body.learning_lang  + '",' +
			'"' + req.body.level  + '",' +
			'NOW()' +	
			'); ';
			
    			res.send(str);
			break;
		default:
			res.send({status:'error', message:'Wrong opt value!'});
	}
};

delete require.cache[env.site_path + '/api/inc/auth/auth.js'];
var AUTH = require(env.site_path + '/api/inc/auth/auth.js'),
    auth = new AUTH(env, pkg, req);

auth.getUid(function(auth_data) {
	if (!auth_data.isAuth || !auth_data.uid) {
		res.send({status:'failure', message:'Auth failure'});
	} else {	
		app(auth_data);
	}
});
