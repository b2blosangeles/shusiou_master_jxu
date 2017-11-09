var mysql = require(env.site_path + '/api/inc/mysql/node_modules/mysql'),
    cfg0 = require(env.site_path + '/api/cfg/db.json');
	
    cfg_m = JSON.parse(JSON.stringify(cfg0 ));
    cfg_m.multipleStatements =  true;	
    
var childProcess = require('child_process');

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
		    cfg0 = require(env.site_path + '/api/cfg/db.json'),
		    mnt_folder = '/mnt/shusiou-video/', 
		    videos_folder = mnt_folder  + 'videos/';
	    
		var connection_m = mysql.createConnection(cfg_m);
		var connection = mysql.createConnection(cfg0);
		
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
		};
		_f_s['local_video']  = function(cbk_s) {
			connection.connect();
			var str = "SELECT `video_code` FROM `video` WHERE `server_ip` = '" + CP_s.data.ip + "' ";
			connection.query(str, function (error, results, fields) {
				connection.end();
				var v = [];
				for (var i=0; i < results.length; i++) v[v.length] = results[i]['video_code'].toString();
				cbk_s(v);
			});
		};		
		_f_s['local_flist']  = function(cbk_s) {
			pkg.fs.readdir(videos_folder, function(err, files) {
				if (err) cbk([]);
				else {
					var CP = new pkg.crowdProcess();
					var _f = {};				
					for (var i = 0; i < files.length; i++) {
						_f[files[i]] = (function(i) {
							return function(cbk) {
								var fn = videos_folder + files[i] + '/video/video.mp4';
								pkg.fs.stat(fn, function(err, st) {
									if (err) {
										cbk(false);
									} else {
										cbk((st)?st.size:'');
									}	
								});								
							}	
						})(i);
					}
					CP.parallel(
						_f,
						function(data) {
							var need_remove =  files.filter(x => CP_s.data.local_video.indexOf(x) < 0 );
							
							var remove_cmd = 'cd ' + mnt_folder  + 'videos/ && rm -fr ';
							for (var j= 0 ; j < Math.min(need_remove.length,30); j++) {
								remove_cmd += ' ' + need_remove[j] + '  ';
							}
							
							if (need_remove.length) {
								var ls = childProcess.exec(remove_cmd, 		   
									function (error, stdout, stderr) {
										cbk_s({need_remove:need_remove, files:files, server_list:data.results});
									});
							} else {
								cbk_s({need_remove:need_remove, files:files, server_list:data.results});
							}							
							
						},
						6000
					);				
				};
				
			});			
		};		
		_f_s['cached']  = function(cbk_s) {
			
			

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
										      url: 'http://'+results[i].node_ip+'/api/node_audit.api?opt=files_status',
										      headers: {
											"content-type": "application/json"
										      },
										      form:{list:list}
										    }, function (error, resp, body) { 
											    if (error) cbk({status:'failure', message:error.message});
											    else {
												var v = [];
												try { v = JSON.parse(body); } catch(e) {
													v = {status:'failure', message:e.message}
												}
												cbk(v);
											    }    
										    });									
									} else { cbk(false); }
								});  
							}	
						})(i);
					}
					CP.parallel(
						_f,
						function(data) {
							cbk_s(data.results);
						},
						6000
					);
				} else { cbk_s(false); }
			}); 
		}
		CP_s.serial(
			_f_s,
			function(data_s) {
				var sql_a = [], diff_a = [];
				for (var o in CP_s.data.cached) {
					var node_list =  CP_s.data.cached[o].node_list;
					var server_list = ((CP_s.data.local_flist) && (CP_s.data.local_flist.server_list))?
					    	CP_s.data.local_flist.server_list:[];
					var v = [], diff_v = [];
					
					for (var p in server_list) {
						if (node_list[p] == server_list[p])  v[v.length] = "'"+p+"'";
						else diff_v[diff_v.length] = "'"+p+"'";
					}
					
					
					if (v.length) {
						sql_a[sql_a.length] = "(`node_ip` = '" + o + "' AND `vid` IN (" + v.join(',') +"));";
					}
					if (diff_v.length) {
						diff_a[diff_a.length] = "(`node_ip` = '" + o + "' AND `vid` IN (" + diff_v.join(',') +"));";
					}
					
				}
				var sql_str = 'UPDATE `video_node` SET `status` = 1 WHERE ' + sql_a.join(' OR ');
				sql_str += 'UPDATE `video_node` SET `status` = 0 WHERE ' + diff_a.join(' OR ');
				/*
				connection_m.query(sql_str, function (error, results_m, fields__m) {
					connection_m.end();
					res.send({results_m:results_m});
				});
				*/
				res.send({d:data_s.results, s:sql_str});
			},
			22000
		);
		break;	
	default:
		res.send({status:'error', message:'Wrong opt value!'});
}
