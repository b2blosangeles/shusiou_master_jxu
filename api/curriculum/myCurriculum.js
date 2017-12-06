var app = function(auth_data) { 
	var mysql = require(env.site_path + '/api/inc/mysql/node_modules/mysql'),
	    config = require(env.config_path + '/config.json'),
	    cfg0 = config.db;
	
	var opt = req.body.cmd;
	var uid = auth_data.uid;
	
	 var cfgM = JSON.parse(JSON.stringify(cfg0));
	 cfgM.multipleStatements = true;
	switch(opt) {
		case 'getList':
			var _f = {};
			_f['S1'] = function(cbk) {
				var connection = mysql.createConnection(cfg0);
				var str = 'SELECT A.*, B.vid FROM  `video` B JOIN `curriculums` A  ON A.vid = B.vid AND A.uid = "' + 
				    uid + '";';

				connection.query(str, function (error, results, fields) {

					if (error) {
						cbk(error.message);
						return true;
					} else {
						cbk(results);
					}
				});  
			};
			connection.connect();
			CP.serial(
				_f,
				function(data) {
					connection.end();
					res.send({_spent_time:data._spent_time, status:data.status, data:data.results.S1});
				},
				3000
			);
			break;				
		case 'add':
			var CP = new pkg.crowdProcess();
			var _f = {};
			_f['A0'] = function(cbk) {  
				var connection = mysql.createConnection(cfgM);
				connection.connect();
				var tm = Math.floor((new Date().getTime()- new Date('2017-12-01').getTime()) * 0.001 / 60) * 10000000000;
				
				var str = 'INSERT INTO  `curriculums` (`curriculum_id`, `uid`,`vid`,`name`,`mother_lang`,`learning_lang`,`level`, `created`) '+
				' VALUES (' + '"' + tm + '",' +
				'"' + uid + '",' +
				'"' + req.body.vid + '",' +
				'"' + req.body.name + '",' +
				'"' + req.body.mother_lang  + '",' +
				'"' + req.body.learning_lang  + '",' +
				'"' + req.body.level  + '",' +
				'NOW()); ' +
				'UPDATE  curriculums SET `curriculum_id` = ' + tm + ' + `id` WHERE `curriculum_id` = "' + 
				  tm + '" AND `uid` = "' + uid + '"';   
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
