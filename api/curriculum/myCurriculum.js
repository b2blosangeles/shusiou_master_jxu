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
			var CP = new pkg.crowdProcess();
			var _f = {};
			_f['S1'] = function(cbk) {
				var connection = mysql.createConnection(cfg0);
				connection.connect();
				var str = 'SELECT A.curriculum_id, B.* FROM `curriculums` A LEFT JOIN  `video` B  ON A.vid = B.vid '+
				    ' WHERE A.uid = "' + uid + '";';

				connection.query(str, function (error, results, fields) {
					connection.end();
					if (error) {
						cbk(error.message);
						return true;
					} else {
						cbk(results);
					}
				});  
			};
			_f['S2'] = function(cbk) {
				var vstr = '0';
				for (var i = 0; i < CP.data.S1.length; i++) {
					vstr += ',' +  CP.data.S1[i].vid; 
				}

				var connection = mysql.createConnection(cfg0);
				connection.connect();

				var str = 'SELECT * FROM  `video_node` WHERE `vid` IN (' + vstr + ')';

				connection.query(str, function (error, results, fields) {
					connection.end();
					var v = {};
					if (results.length) {
						
						for (var i = 0; i < results.length; i++) {
							if (!v[results[i].vid]) v[results[i].vid] = [];
							v[results[i].vid][v[results[i].vid].length] = results[i].node_ip;
						}
						cbk(v);
					} else cbk(v);
				});  
			};			
			CP.serial(
				_f,
				function(data) {
					var d = [];
					for (var i=0; i <  CP.data.S1.length; i++) {
						CP.data.S1[i].node_ip = CP.data.S2[CP.data.S1[i].vid];
						d[d.length] =  CP.data.S1[i];
					}
					res.send({_spent_time:data._spent_time, status:data.status, data:d});
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
		case 'delete':
			var CP = new pkg.crowdProcess();
			var _f = {};
			_f['A0'] = function(cbk) {  
				var connection = mysql.createConnection(cfgM);
				connection.connect();
				var curriculum_id = req.body.curriculum_id;
				var str = 'DELETE FROM `curriculums` WHERE `curriculum_id` = "' + curriculum_id + '" AND `uid` = "' + uid + '"';   
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
		case 'getCurriculumById':
			var CP = new pkg.crowdProcess();
			var _f = {};
			var curriculum_id = req.body.curriculum_id;
			_f['S1'] = function(cbk) {
				var connection = mysql.createConnection(cfg0);
				connection.connect();
				var str = 'SELECT A.curriculum_id, B.* FROM `curriculums` A LEFT JOIN  `video` B  ON A.vid = B.vid '+
				    ' WHERE A.curriculum_id = "' + curriculum_id + '" AND  A.uid = "' + uid + '";';

				connection.query(str, function (error, results, fields) {
					connection.end();
					if (error) {
						cbk(error.message);
						return true;
					} else {
						cbk(results);
					}
				});  
			};
			_f['S2'] = function(cbk) {
				var vstr = '0';
				for (var i = 0; i < CP.data.S1.length; i++) {
					vstr += ',' +  CP.data.S1[i].vid; 
				}

				var connection = mysql.createConnection(cfg0);
				connection.connect();

				var str = 'SELECT * FROM  `video_node` WHERE `vid` IN (' + vstr + ')';

				connection.query(str, function (error, results, fields) {
					connection.end();
					var v = {};
					if (results.length) {
						
						for (var i = 0; i < results.length; i++) {
							if (!v[results[i].vid]) v[results[i].vid] = [];
							v[results[i].vid][v[results[i].vid].length] = results[i].node_ip;
						}
						cbk(v);
					} else cbk(v);
				});  
			};			
			CP.serial(
				_f,
				function(data) {
					var d = [];
					for (var i=0; i <  CP.data.S1.length; i++) {
						CP.data.S1[i].node_ip = CP.data.S2[CP.data.S1[i].vid];
						d[d.length] =  CP.data.S1[i];
					}
					res.send({_spent_time:data._spent_time, status:data.status, data:d});
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
