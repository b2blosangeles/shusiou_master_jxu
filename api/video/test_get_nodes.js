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

		
		var CP_s = new pkg.crowdProcess();
		var _f_s = {};		
		_f_s['ip']  = function(cbk_s) {
		    pkg.fs.readFile('/var/.qalet_whoami.data', 'utf8', function(err,data) {
			if ((err) || !data) {
				cbk_s(false); CPs.exit = 1;		
			} else {
				cbk_s(data.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g,'').replace(/\s+/g,' '));
			}
		    });
		}
		_f_s['P0']  = function(cbk_s) {
			var connection = mysql.createConnection(cfg0);
			connection.connect();
			var str = "SELECT `node_ip` FROM `cloud_node` WHERE `node_ip` IN (SELECT `node_ip` FROM `video_node`) ";
			connection.query(str, function (error, results, fields) {
				connection.end();
				if (error) { cbk_s(false); } 
				else if (results) { 
					var CP = new pkg.crowdProcess();
					var _f = {};				
					for (var i = 0; i < results.length; i++) {
						_f[results[i].node_ip] = (function(i) {
							return function(cbk) {
								var connection = mysql.createConnection(cfg0);
								connection.connect();
								var str = "SELECT A.`vid`, A.`status` FROM `video_node` A "+
								    "LEFT JOIN `video` B ON A.`vid` = B.`video_code` "+
								    "WHERE A.`node_ip` = '" + results[i].node_ip + "' "+
								    " AND B.server_ip = '" + CP_s.data.ip + "'";
								connection.query(str, function (error, results1, fields) {
									connection.end();
									if (error) { cbk(false); } 
									else if (results) {
										var list = [], list_done = [];
										for (var j = 0; j < results1.length;j++) {
											// if (results[j].status)  
											list[ list.length] = results1[j].vid;
											// else list_null[ list_null.length] = results[j].vid;
										}
										pkg.request({
										      url: 'http:/'+results[i].node_ip+'/api/node_audit.api?files_status',
										      headers: {
											"content-type": "application/json"
										      },
										      form:{list:list}
										    }, function (error, resp, body) { 
											    var s = {};
											    try { s = JSON.parse(body); } catch (e) {}
											    cbk(body);
										    });									
									} else { cbk(false); }
								});  
							}	
						})(i);
					}
					CP.parallel(
						_f,
						function(data) {
							cbk_s(data);
						},
						6000
					);
				} else { cbk_s(false); }
			}); 
		}
		CP_s.serial(
			_f_s,
			function(data_s) {
				res.send(data_s.results);
			},
			6000
		);		
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
