var app = function(auth_data) { 
	var mysql = require(env.site_path + '/api/inc/mysql/node_modules/mysql'),
	    config = require(env.config_path + '/config.json'),
	    cfg0 = config.db;
	
	var opt = req.body.cmd;
	var uid = auth_data.uid;
	
	var connection = mysql.createConnection(cfg0);	
	
	switch(opt) {
		case 'add':
			var CP = new pkg.crowdProcess();
			var _f = {};
			_f['A0'] = function(cbk) {  
				var connection = mysql.createConnection(cfg0);
				connection.connect();
				var str = 'INSERT INTO  curriculums (`uid`,`vid`,`name`,`mother_lang`,`learning_lang`,`level`, `created`) '+
				' VALUES (' +
				'"' + uid + '",' +
				'"' + req.body.vid + '",' +
				'"' + req.body.name + '",' +
				'"' + req.body.mother_lang  + '",' +
				'"' + req.body.learning_lang  + '",' +
				'"' + req.body.level  + '",' +
				'NOW()' +	
				'); ';	
				cbk(str);
				return true;
				var str = "SELECT A.`id`"+    
					" FROM `download_failure` A LEFT JOIN `video_user` B ON A.`vid` = B.`vid` " +
					" WHERE B.`uid` = '" + uid + "' AND NOW() - B.`created` > 36000; ";
				connection.query(str, function (error, results, fields) {
					connection.end();
					if (error)  cbk(false);
					else if (results) { 
						var v = [];
						for (var i = 0; i < results.length; i++) {
							v[v.length] = results[i].id;
						}
						cbk(v.join(','));
					} else cbk(false);
				});  
			};	
			CP.serial(
				_f,
				function(data) {
					connection.end();
					res.send({_spent_time:data._spent_time, status:data.status, curriculum: data.results});
				},
				3000
			);
			break;				
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
			/*
			var str = '--INSERT INTO  curriculums (`uid`,`vid`,`name`,`mother_lang`,`learning_lang`,`level`, `created`) '+
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
			*/
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
