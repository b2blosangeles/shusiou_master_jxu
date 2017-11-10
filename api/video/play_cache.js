var type= req.query['type'], vid = req.query['vid'];
if (!type || !vid) {  write404('vid or type error '); return true; }

var ytdl = require(env.site_path + '/api/inc/ytdl-core/node_modules/ytdl-core'),
    mysql = require(env.site_path + '/api/inc/mysql/node_modules/mysql'),
    cfg0 = require(env.site_path + '/api/cfg/db.json');

var url = req.url.replace('/play_cache.api', '/play_stream.api');
var connection = mysql.createConnection(cfg0);
	connection.connect();
	var str = "SELECT A.`vid`, A.`node_ip`, B.`server_ip` "+    
	    	 " FROM `video_node` AS A LEFT JOIN `video` AS B  ON A.`vid` = B.`video_code` " +
		 " WHERE A.`vid` = '" + vid + "' AND A.`status` = '1'; ";

	connection.query(str, function (error, results, fields) {
		connection.end();
		if (error)  res.redirect(url);
		else if (results) { 
			var v = [];
			for (var i = 0; i < results.length; i++) {
				v[v.length] = results[i];
			}
			
			if (!v.length) {
				res.redirect(url);
			} else {
				var vi =  v[Math.floor(Math.random() * v.length)], patt = /([?&]server)=([^#&]*)/i;
				if (patt.test(url)) url = ('http://'+ vi['node_ip'] + url).replace(patt,'$1=' + vi['server_ip']);
				else url = 'http://'+ vi['node_ip'] + url + '&server=' + vi['server_ip'];
				res.send(url);
			}	
		} else res.redirect(url);
	});  

return true;

function write404(msg) {
	res.writeHead(404);
	res.write(msg);
	res.end();	
}
