var mysql = require(env.site_path + '/api/inc/mysql/node_modules/mysql');
var CP = new pkg.crowdProcess();
var cfg0 = require(env.site_path + '/api/cfg/db.json');
var connection = mysql.createConnection(cfg0);

switch(req.body.cmd) {
	case 'getCurriculumById':
		var _f = {};
		_f['S1'] = function(cbk) {
			if (!req.body.cid) {
				cbk({}); return true;
			}
			var str = 'SELECT A.*, B.`script` FROM  `curriculums` A LEFT JOIN `curriculum_sections` B ON A.id = B.cid WHERE A.id = "' + req.body.cid + '"; ';
			connection.query(str, function (error, results, fields) {
				if (error) {
					cbk(error.message);
					return true;
				} else {
					try {
						var v = JSON.parse(decodeURIComponent(results[0].script));
					//	var v = JSON.parse(results[0].script);
						for (var i = 0; i < v.length; i++) {
							if (v[i].track) {
								v[i].track.s = parseFloat(v[i].track.s);
								v[i].track.t = parseFloat(v[i].track.t);
							}
						}
						results[0].script = v;
					} catch(err) { 
						results[0].script = null;
					}
					if (!results[0].script) results[0].script = [];
					cbk(results[0]);
				}
			});  
		};
		_f['S2'] = function(cbk) {
			if (!CP.data.S1.vid) {
				cbk({});
				return true;
			}
			var str = 'SELECT A.*, B.* FROM  `videos` A LEFT JOIN `video_node` B ON A.id = B.video_id '+
			    ' WHERE A.id = "' + CP.data.S1.vid + '"; ';
			connection.query(str, function (error, results, fields) {

				if (error) {
					cbk(error.message);
					return true;
				} else {
					cbk(results[0]);
				}
			});  
		};
		connection.connect();
		CP.serial(
			_f,
			function(data) {
				connection.end();
				res.send({_spent_time:data._spent_time, status:data.status, curriculum: data.results.S1, video:data.results.S2});
			},
			3000
		);
		break;
	case 'getList':
		var _f = {};
		_f['S1'] = function(cbk) {
			var connection = mysql.createConnection(cfg0);


			var str = 'SELECT A.*, B.code FROM  `videos` B JOIN `curriculums` A  ON A.vid = B.id AND A.uid = "' + req.body.auth.uid + '";';

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
	case 'getPublicList':
		var _f = {};
		_f['S1'] = function(cbk) {
			var connection = mysql.createConnection(cfg0);
			var str = 'SELECT A.*, B.code FROM  `videos` B JOIN `curriculums` A  ON A.vid = B.id WHERE A.published = 1;';
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
	case 'update':
		var _f = {};

		_f['S1'] = function(cbk) {
			var str = 'UPDATE  `curriculums` SET ' +
			'`name` = "' + req.body.name + '",' +
			'`published` = "' + ((req.body.published)?req.body.published:0) + '",' +    
			'`created` = NOW() ' +
			'WHERE `id` ="' + req.body.id + '"; ';

			connection.query(str, function (error, results, fields) {

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
			var str = 'DELETE FROM  `curriculum_sections` ' +
			'WHERE `cid` ="' + req.body.id + '"; ';

			connection.query(str, function (error, results, fields) {

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
		_f['S3'] = function(cbk) {
			var section = JSON.stringify(req.body.sections);
			section = section.replace('"','\"');
			var str = 'INSERT INTO  `curriculum_sections` (`cid`,`type`,`script`, `created`) VALUES ("' +
			req.body.id + '",' +
			'"niuA",' +
			// '"'+ encodeURIComponent(JSON.stringify(req.body.sections)) + '",' +
			"'"+ section + "'," +
			'NOW()' +	
			'); ';

			connection.query(str, function (error, results, fields) {

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
		connection.connect();
		CP.serial(
			_f,
			function(data) {
				connection.end();
				res.send({_spent_time:data._spent_time, status:data.status, data:data});
			},
			30000
		);
		break;		
	case 'add':
		var _f = {};

		_f['S1'] = function(cbk) {
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
			connection.query(str, function (error, results, fields) {

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
		connection.connect();
		CP.serial(
			_f,
			function(data) {
				connection.end();
				res.send({_spent_time:data._spent_time, status:data.status, data:data.results.S1.insertId});
			},
			30000
		);
		break;
	case 'delete':
		var _f = {};

		_f['S1'] = function(cbk) {
			var str = 'DELETE FROM  curriculums WHERE `id` ="' + req.body.cid + '" AND `uid` = "' + req.body.auth.uid + '"; ';
			connection.query(str, function (error, results, fields) {
				if (error) {
					cbk(error.message);
					return true;
				} else {
					if (results[0]) {
						cbk(results[0]);
						CP.skip = true;
					} else {
						cbk(false);
					}

				}
			});  
		};
		connection.connect();
		CP.serial(
			_f,
			function(data) {
				connection.end();
				res.send({_spent_time:data._spent_time, status:data.status, data:data});
			},
			30000
		);
		break;		
	default:
		res.send({seatus:'error', message:'Missing or Wrong CMD!'});
}		
