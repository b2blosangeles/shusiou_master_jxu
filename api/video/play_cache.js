var type= req.query['type'], vid = req.query['vid'];
if (!type || !vid) {  write404('vid or type error '); return true; }

var ytdl = require(env.site_path + '/api/inc/ytdl-core/node_modules/ytdl-core'),
    mysql = require(env.site_path + '/api/inc/mysql/node_modules/mysql'),
    cfg0 = require(env.site_path + '/api/cfg/db.json');

var connection = mysql.createConnection(cfg0);
	connection.connect();
	var str = "SELECT A.`vid`, A.`node_id`, B.`server_ip` "+    
	    	 " FROM `video_node` A LEFT JOIN `video` B ON A.`vid` = B.`video_code` " +
		 " WHERE A.`vid` = '" + vid + "' AND A.`status` = '1'; ";
	
	connection.query(str, function (error, results, fields) {
		connection.end();
		if (error)  res.send(str );
		else if (results) { 
			var v = [];
			for (var i = 0; i < results.length; i++) {
				v[v.length] = results[i].vid;
			}
			res.send(results);
		} else res.send(str );
	});  
return true;
res.redirect(req.url.replace('/play_cache.api?', '/play_stream.api?'));
return true;

function write404(msg) {
	res.writeHead(404);
	res.write(msg);
	res.end();	
}
