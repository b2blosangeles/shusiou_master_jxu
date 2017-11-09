var ytdl = require(env.site_path + '/api/inc/ytdl-core/node_modules/ytdl-core'),
    mysql = require(env.site_path + '/api/inc/mysql/node_modules/mysql'),
    cfg0 = require(env.site_path + '/api/cfg/db.json');

var connection = mysql.createConnection(cfg0);
	connection.connect();
	var str = "SELECT * "+    
		" FROM `video_node` " +
		" WHERE 1; ";
	connection.query(str, function (error, results, fields) {
		connection.end();
		if (error)  res.send(false);
		else if (results) { 
			var v = [];
			for (var i = 0; i < results.length; i++) {
				v[v.length] = results[i].id;
			}
			ews.send(v.join(','));
		} else res.send(false);
	});  
return true;
res.redirect(req.url.replace('/play_cache.api?', '/play_stream.api?'));
return true;

function write404(msg) {
	res.writeHead(404);
	res.write(msg);
	res.end();	
}
