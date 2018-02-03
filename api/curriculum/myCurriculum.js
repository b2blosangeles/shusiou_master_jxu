function jsonToQueryString(o) {
	return JSON.stringify(o).replace(/'/g, "\\'");
};
function queryStringToJSON(s, o) {
	try { o = JSON.parse(s.replace(/\\\'/g, "'")); } catch (e) {}
	return o;
};
var app = function(auth_data) { 
	var mysql = require(env.site_path + '/api/inc/mysql/node_modules/mysql'),
	    config = require(env.config_path + '/config.json'),
	    cfg0 = config.db;
	
	var opt = req.body.cmd;
	var uid = auth_data.uid;
	
	
	 var cfgM = JSON.parse(JSON.stringify(cfg0));
	 cfgM.multipleStatements = true;
	switch(opt) {
		case 'saveSection':
		case 'deleteSection':
			var curriculum_id = req.body.data.curriculum_id;
			var CP = new pkg.crowdProcess();
			var _f = {};
			_f['S0'] = function(cbk) {
				var str = 'SELECT * FROM  `curriculum_sections` WHERE `curriculum_id` = "' + 
				    curriculum_id + '"; ';
				var connection = mysql.createConnection(cfg0);
				connection.connect();
				connection.query(str, function (error, results, fields) {
					connection.end();
					if (error) {
						cbk(error.message);
						return true;
					} else {
						if (results) {
							cbk(queryStringToJSON(results[0].script, []));
						} else {
							cbk(false);
						}

					}
					
				});  
			};
			_f['P0'] = function(cbk) {
				let v = CP.data.S0;

				if (opt === 'saveSection' && req.body.data.section.section_id === 'new') {
					v[v.length] = req.body.data.section;
				} else if (opt === 'saveSection') {
					
					for (var i = 0; i < v.length; i++) {
						
						if (v[i].section_id == req.body.data.section.section_id) {
							v[i] = req.body.data.section;
						//	break;
						} 
						if (v[i].track) {
							if (v[i].track.s) v[i].track.s = 1 * v[i].track.s;
							if (v[i].track.t) v[i].track.t = 1 * v[i].track.t;				
						}						
					}					
					
				} else if (opt === 'deleteSection')  {
					var lv = v.filter(function(a) {
						return a.section_id != req.body.data.section.section_id;
					});
					v = lv;
				}
				
				v.sort(function(a1, a2) {
					let s1 = (a1.data.track)?a1.data.track.s:0, s2 = (a1.data.track)?a2.data.track.s:0
					return (s1 > s2)
				});
				
				for (var i = 0; i < v.length; i++) {
					v[i].section_id = i + 1;
				}
				var str = 'INSERT INTO  `curriculum_sections` (`curriculum_id`,`type`,`script`, `created`) VALUES ("' +
				curriculum_id + '",' +
				'"niuA",' +
				"'" + jsonToQueryString(req.body.data.section) + "'," +
				'NOW()' +	
				') ON DUPLICATE KEY UPDATE `script` = ' + 
				"'" + jsonToQueryString(v) + "'"  + 
				'; ';
				var connection = mysql.createConnection(cfg0);
				connection.connect();
				connection.query(str, function (error, results, fields) {
					connection.end();
					if (error) {
						cbk(error.message);
						return true;
					} else {
						if (results) {
							cbk(req.body.data.section); // req.body.data.section
						} else {
							cbk(false);
						}

					}
				}); 
			};
			_f['S1'] = function(cbk) {
				var str = 'SELECT * FROM  `curriculum_sections` WHERE `curriculum_id` = "' + 
				    curriculum_id + '"; ';
				var connection = mysql.createConnection(cfg0);
				connection.connect();
				connection.query(str, function (error, results, fields) {
					connection.end();
					if (error) {
						cbk(error.message);
						return true;
					} else {
						if (results) {
							cbk(queryStringToJSON(results[0].script, []));
						} else {
							cbk(false);
						}

					}
					
				});  
			};			
			CP.serial(
				_f,
				function(data) {
					res.send({_spent_time:data._spent_time, status:'success', data:data.results.P0});
				},
				30000
			);
			break;	
			
		case 'getList':
			var CP = new pkg.crowdProcess();
			var _f = {};
			_f['S1'] = function(cbk) {
				var connection = mysql.createConnection(cfg0);
				connection.connect();
				var str = 'SELECT A.curriculum_id, A.`name`, B.* FROM `curriculums` A LEFT JOIN  `video` B  ON A.vid = B.vid '+
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
					} else cbk({});
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
		case 'update':
			var CP = new pkg.crowdProcess();
			
			var _f = {};
			_f['S1'] = function(cbk) {
				var str = 'UPDATE  `curriculums` SET ' +
				'`name` = "' + req.body.name + '",' +
				'`published` = "' + ((req.body.published)?req.body.published:0) + '",' +    
				'`created` = NOW() ' +
				'WHERE `curriculum_id` ="' + req.body.curriculum_id + '"; ';
				var connection = mysql.createConnection(cfg0);
				connection.connect();
				connection.query(str, function (error, results, fields) {
					connection.end();
					if (error) {
						cbk(error.message);
						return true;
					} else {
						if (results[0]) {
							cbk(results[0]);
						} else {
							cbk(false);
						}

					}
				});  
			};
			
			_f['S2'] = function(cbk) {
				var str = 'DELETE FROM  `curriculum_sections` WHERE `curriculum_id` = "' + req.body.curriculum_id + '"; ';
				var connection = mysql.createConnection(cfg0);
				connection.connect();
				connection.query(str, function (error, results, fields) {
					connection.end();
					if (error) {
						cbk(error.message);
						return true;
					} else {
						if (results) {
							cbk('results');
						} else {
							cbk(false);
						}

					}
					
				});  
			};
			
			_f['S3'] = function(cbk) {
				var section = (req.body.section)?req.body.section:{};
				var sections = (req.body.sections)?req.body.sections:[];
				if (section.id == 'new') {
					section.id = new Date().getTime();
					sections[sections.length] = section;
				} else {
					for (var i = 0; i < sections.length; i++) {
						if (sections[i].id == section.id) {
							sections[i] = section;
							break;
						}
					}
				}
				var str = 'INSERT INTO  `curriculum_sections` (`curriculum_id`,`type`,`script`, `created`) VALUES ("' +
				req.body.curriculum_id + '",' +
				'"niuA",' +
				'"' + encodeURIComponent(JSON.stringify(sections)) + '",' +
				'NOW()' +	
				'); ';
				var connection = mysql.createConnection(cfg0);
				connection.connect();
				connection.query(str, function (error, results, fields) {
					connection.end();
					if (error) {
						cbk(error.message);
						return true;
					} else {
						if (results) {
							cbk(results);
						} else {
							cbk(false);
						}

					}
				});  
			};
			
			CP.serial(
				_f,
				function(data) {
					
					res.send({_spent_time:data._spent_time, status:data.status, data:data});
				},
				30000
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
				var str = 'SELECT A.*, B.*, C.`script` FROM `curriculums` A LEFT JOIN  `video` B  ON A.vid = B.vid '+
				    ' LEFT JOIN `curriculum_sections` C ON A.curriculum_id = C.curriculum_id ' +
				    ' WHERE A.curriculum_id = "' + curriculum_id + '" AND  A.uid = "' + uid + '";';

				connection.query(str, function (error, results, fields) {
					connection.end();
					if (error) {
						cbk(error.message);
						return true;
					} else {
						cbk(results[0]);
					}
				});  
			};
			_f['S2'] = function(cbk) {
				var connection = mysql.createConnection(cfg0);
				connection.connect();

				var str = 'SELECT * FROM  `video_node` WHERE `vid` = "' + CP.data.S1.vid + '"';

				connection.query(str, function (error, results, fields) {
					connection.end();
					var v = [];
					if (results.length) {
						for (var i = 0; i < results.length; i++) {
							v[v.length] = results[i].node_ip;
						}	
					} 
					cbk(v);
				});  
			};			
			CP.serial(
				_f,
				function(data) {
					try {
						CP.data.S1.sections =queryStringToJSON(CP.data.S1.script, []);
						let v = CP.data.S1.sections;
						for (var i=0; i < v.length; i++) {
							if (!v[i].data.track) {
								v[i].data.track = {};
							} else {
								if (v[i].data.track.s) v[i].data.track.s = 1 * v[i].data.track.s;
								if (v[i].data.track.t) v[i].data.track.t = 1 * v[i].data.track.t;				
							}
						}
					} catch (err) {
					};	
					CP.data.S1.node_ip = CP.data.S2;
					delete CP.data.S1.script;
					res.send({_spent_time:data._spent_time, status:data.status, data:CP.data.S1});
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
