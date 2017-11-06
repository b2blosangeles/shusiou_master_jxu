var mysql = require(env.site_path + '/api/inc/mysql/node_modules/mysql'),
    cfg0 = require(env.site_path + '/api/cfg/db.json');

var opt = req.query['opt'];

switch(opt) {
	case 'getVideoNode':
		delete require.cache[env.site_path + '/api/inc/videoNode/videoNode.js'];
		var videoNode = require(env.site_path + '/api/inc/videoNode/videoNode.js');
		
		var vid = req.query['vid'];
		
		var vn = new  videoNode(env, pkg);
		vn.getIP(vid, function(data){
			res.send(data);
		});
		return true;
		break;
	case 'getVideoNodeStatus':
		
		var mysql = require(env.site_path + '/api/inc/mysql/node_modules/mysql'),
    		cfg0 = require(env.site_path + '/api/cfg/db.json');		

		var connection = mysql.createConnection(cfg0);
		connection.connect();
		var str = "SELECT `node_ip` FROM `cloud_node` WHERE `node_ip` IN (SELECT `node_ip` FROM `video_node`) ";
		connection.query(str, function (error, results, fields) {
			connection.end();
			if (error) { res.send(false); } 
			else if (results) { 
				var CP = new pkg.crowdProcess();
				var _f = {};
				for (var i = 0; i < results.length; i++) {
					_f[results[i].node_ip] = (function(i) {
						return function(cbk) {
							var connection = mysql.createConnection(cfg0);
							connection.connect();
							var str = "SELECT `vid`, `status` FROM `video_node` WHERE node_ip = '" + results[i].node_ip + "' ";
							connection.query(str, function (error, results, fields) {
								connection.end();
								if (error) { cbk(false); } 
								else if (results) { 
									cbk(results);
								} else { cbk(false); }
							});  
						}	
					})(i);
				}
				CP.parallel(
					_f,
					function(data) {
						res.send(data.results);
					},
					6000
				);
			} else { res.send(false); }
		});  
		return true;		
		
		var connection = mysql.createConnection(cfg0);
		connection.connect();
		var str = "SELECT A.`node_ip`, A.`vid`, A.`status` FROM `video_node` A  LEFT JOIN `video` B ON A.`vid` = B.`video_code`  WHERE 1 ";
		connection.query(str, function (error, results, fields) {
			connection.end();
			if (error) { res.send(false); } 
			else if (results) { 
				res.send(results);
			} else { res.send(false); }
		});  
		return true;
		
		delete require.cache[env.site_path + '/api/inc/videoNode/videoNode.js'];
		var videoNode = require(env.site_path + '/api/inc/videoNode/videoNode.js');

		var vid = req.query['vid'];
		
		var mnt_folder = '/mnt/shusiou-video/';
		var fn = mnt_folder + 'videos/' + vid + '/video/video.mp4';
		

		
		
		var vn = new  videoNode(env, pkg);
		vn.getIP(vid, function(data){
			pkg.fs.stat(fn, function(err, stat) {
				res.send({ips:data.list, state:stat.size});
			});			
		});
		return true;
		break;		
	default:
		res.send({status:'error', message:'Wrong opt value!'});
}
