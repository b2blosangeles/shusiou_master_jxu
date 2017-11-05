var mysql = require(env.site_path + '/api/inc/mysql/node_modules/mysql'),
    cfg0 = require(env.site_path + '/api/cfg/db.json');

var opt = req.query['opt'];

switch(opt) {
	case 'getVideoNode':
		delete require.cache[env.site_path + '/api/inc/videoNode/videoNode.js'];
		var videoNode = require(env.site_path + '/api/inc/videoNode/videoNode.js');
		var vn = new  videoNode(env, pkg);
		vn.getIP(1, function(data){
			res.send(data);
		});
		return true;
		
		var vid = req.query['vid'];
		if (!vid) {
			res.send({status:'failure', message:'Missing vid'});
			return true;
		}
		var CP = new pkg.crowdProcess();
		var _f = {};
		
		_f['P0'] = function(cbk) {  /* Clean old download_falure related record */
			var connection = mysql.createConnection(cfg0);
			connection.connect();
			var str = "SELECT * FROM `video_node` WHERE `vid` = '" + vid + "' ";
			connection.query(str, function (error, results, fields) {
				connection.end();
				if (error) { cbk(false); CP.exit = 1;
				} else if (results) { 
					var v = [];
					for (var i = 0; i < results.length; i++) {
						v[v.length] = results[i]['node_ip'];
					}
					cbk(v);
				} else { cbk(false); CP.exit = 1; }
			});  
		};
		_f['P1'] = function(cbk) {  
			var cnt = CP.data.P0.length, max = 2;
			if ((max - cnt) > 0) {
				var connection = mysql.createConnection(cfg0);
				connection.connect();
				var w = JSON.parse(JSON.stringify(CP.data.P0));
				
				for (var i = 0; i < w.length; i++) {
					w[i] = "'" + w[i] + "'";
				}
				var wstr = w.join(',');
				var str = "SELECT * FROM `cloud_node` WHERE `free` < 50 AND `node_ip` NOT IN (" + ((wstr)?wstr:"''") + ") LIMIT " + max + " ";
				connection.query(str, function (error, results, fields) {
					connection.end();
					if (error) { cbk(str); CP.exit = 1;} 
					else if (results.length) { 
						var v = [];
						for (var i = 0; i < results.length; i++) {
							v[v.length] = results[i]['node_ip'];
						}
						cbk(v);
					} else { cbk(str); CP.exit = 1; }
				});  
			} else {
				cbk(false); CP.exit = 1;
			}
		};
		_f['P2'] = function(cbk) {  
			var w = JSON.parse(JSON.stringify(CP.data.P1));	
			for (var i = 0; i < w.length; i++) {
				w[i] = '('+vid + ",'" + w[i] + "')";
			}
			var str = 'INSERT INTO `video_node` (`vid`, `node_ip`) VALUES ' + w.join(',');
			var connection = mysql.createConnection(cfg0);
			connection.connect();	
			connection.query(str, function (error, results, fields) {
				connection.end();
				if (error) { cbk(str); } 
				else if (results) { 
					cbk(results);
				} else { cbk(str + '==');  }
			});  			
		};	
		CP.serial(
			_f,
			function(data) {
				res.send({status:'success', _spent_time:data._spent_time, data:data.results});
			},
			6000
		);
		break;
	default:
		res.send({status:'error', message:'Wrong opt value!'});
}
