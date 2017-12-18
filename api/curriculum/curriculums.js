var mysql = require(env.site_path + '/api/inc/mysql/node_modules/mysql'),
     	CP = new pkg.crowdProcess(),
	config = require(env.config_path + '/config.json'),
	cfg0 = config.db;

var connection = mysql.createConnection(cfg0);
switch(req.body.cmd) {
	case 'getPublicList':
		var _f = {};
		_f['S1'] = function(cbk) {
			var connection = mysql.createConnection(cfg0);
			var str = 'SELECT A.*, B.vid, B.server_ip FROM `curriculums` A LEFT JOIN `video` B  ON A.vid = B.vid WHERE A.published = 1;';
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
	case 'getCurriculumById':
		var CP = new pkg.crowdProcess();
		var _f = {};
		var curriculum_id = req.body.curriculum_id;
		_f['S1'] = function(cbk) {
			var connection = mysql.createConnection(cfg0);
			connection.connect();
			var str = 'SELECT A.*, B.*, C.`script` FROM `curriculums` A LEFT JOIN  `video` B  ON A.vid = B.vid '+
			    ' LEFT JOIN `curriculum_sections` C ON A.curriculum_id = C.curriculum_id ' +
			    ' WHERE A.curriculum_id = "' + curriculum_id + '";';

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
					CP.data.S1.script = JSON.parse(decodeURIComponent(CP.data.S1.script));
				} catch (err) {
				};	
				CP.data.S1.node_ip = CP.data.S2;
				res.send({_spent_time:data._spent_time, status:data.status, data:CP.data.S1});
			},
			3000
		);
		break;		
	default:
		res.send({seatus:'error', message:'Missing or Wrong CMD!'});
}		
