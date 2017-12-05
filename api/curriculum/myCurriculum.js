var app = function(auth_data) { 
	var mysql = require(env.site_path + '/api/inc/mysql/node_modules/mysql'),
	    config = require(env.config_path + '/config.json'),
	    cfg0 = config.db;
	
	var opt = req.body.cmd;
	var uid = auth_data.uid;
	
	 var cfgM = JSON.parse(JSON.stringify(cfg0));
	 cfgM.multipleStatements = true;
	// var connection = mysql.createConnection(cfg0);	
	
	switch(opt) {
		case 'add':
		//	var connection = mysql.createConnection(cfg);
			var CP = new pkg.crowdProcess();
			var _f = {};
			_f['A0'] = function(cbk) {  
				var connection = mysql.createConnection(cfgM);
				connection.connect();
				var tm = Math.floor((new Date().getTime()- new Date('2017-12-01').getTime()) * 0.001 / 60) * 10000000000;
				
				var str = 'INSERT INTO  curriculums (`curriculum_id`, `uid`,`vid`,`name`,`mother_lang`,`learning_lang`,`level`, `created`) '+
				' VALUES (' + '"0",' +
				'"' + uid + '",' +
				'"' + req.body.vid + '",' +
				'"' + req.body.name + '",' +
				'"' + req.body.mother_lang  + '",' +
				'"' + req.body.learning_lang  + '",' +
				'"' + req.body.level  + '",' +
				'NOW()' +	
				'); ' +
				'UPDATE  curriculums SET `curriculum_id` = ' + tm + ' + `id` WHERE `curriculum_id` = "0" ';   
				connection.query(str, function (error, results, fields) {
					connection.end();
					if (error)  cbk(false);
					else if (results) { 
						cbk(results);
					} else cbk(false);
				});  
			};	
			CP.serial(
				_f,
				function(data) {
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
