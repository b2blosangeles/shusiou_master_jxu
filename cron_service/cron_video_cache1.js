/* ---  This cron is to appoint node for video. add record link only */
var path = require('path');
var env = {root_path:path.join(__dirname, '../..')};
env.site_path = env.root_path + '/site';

var mysql = require(env.site_path + '/api/inc/mysql/node_modules/mysql'),
    crowdProcess =  require(env.root_path + '/package/crowdProcess/crowdProcess'),
    cfg0 = require(env.site_path + '/api/cfg/db.json'),
    fs = require('fs');


var CP_s = new crowdProcess();
var _f_s = {};		
_f_s['ip']  = function(cbk_s) {
    fs.readFile('/var/.qalet_whoami.data', 'utf8', function(err,data) {
	if ((err) || !data) {
		cbk_s(false); CP_s.exit = 1;		
	} else {
		cbk_s(data.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g,'').replace(/\s+/g,' '));
	}
    });
};
_f_s['remove_offline_node']  = function(cbk_s) { /* remove offline node  score < 1670 */  
	var connection = mysql.createConnection(cfg0);
	connection.connect();
	var str = 'DELETE FROM `video_node` ' +
		' WHERE `node_ip` NOT IN (SELECT `node_ip` FROM `cloud_node` WHERE score < 1670) ';
	
	connection.query(str, function (error, results, fields) {
		connection.end();
		cbk_s(true);	
	});
};
_f_s['need_remove']  = function(cbk_s) { /* get database catched local videos */
	var connection = mysql.createConnection(cfg0);
	connection.connect();
	var str = 'SELECT A.`vid` FROM `video_node` A LEFT JOIN `video` B ' +
		' ON A.`vid` = B.`vid`  ' +
		' WHERE  B.`server_ip` = "' + CP_s.data.ip + '" AND A.`node_ip` IN (SELECT `node_ip` FROM `cloud_node` WHERE score < 1000) ' +
		' GROUP BY A.`vid` ' +
		' HAVING count(A.`vid`) > (SELECT `cache_count` FROM `video_channel` WHERE `vid` = A.`vid` ' + 
	    	' 	AND (`channel` IS  NULL OR `channel` = "")  UNION SELECT 1 LIMIT 1)  ' +
		' ORDER BY count(A.`vid`) ASC LIMIT 10';
	
	connection.query(str, function (error, results, fields) {
		connection.end();
		if (error || !results.length) {
			cbk_s(false);
		}
		var v = [];
		for (var i=0; i < results.length; i++) v[v.length] = results[i].vid;
		if (v.length) {
			var str = 'DELETE FROM `video_node` WHERE `vid` IN (' + v.join(',') + ')';
			var connection1 = mysql.createConnection(cfg0);
			connection1.connect();
			connection1.query(str, function (error1, results1, fields1) {
				connection1.end();
				if (error1) {
					cbk_s(error1.message); CP_s.exit = 1;
				} else {
					cbk_s(true);
				}
			});	
		} else {
			cbk_s(false);
		}	
	});
};
_f_s['need_add']  = function(cbk_s) { /* get database catched local videos */
	var connection = mysql.createConnection(cfg0);
	connection.connect();
	var str = 
	    	'SELECT  `vid`, `node_ip` FROM `video_node` WHERE `vid` IN (' +
			'SELECT A.`vid` FROM `video_node` A LEFT JOIN `video` B ' +
			' ON A.`vid` = B.`vid`  ' +
			' WHERE  A.`node_ip` IN (SELECT `node_ip` FROM `cloud_node` WHERE score < 1000) ' +
			' GROUP BY A.`vid` ' +
			' HAVING  count(A.`vid`) < (SELECT `cache_count` FROM `video_channel` WHERE `vid` = A.`vid` ' + 
	    		'	AND (`channel` IS  NULL OR `channel` = "")  UNION SELECT 1 LIMIT 1)  ' +
			' ORDER BY  count(A.`vid`) ASC '+
		' )';
		
		console.log('===== need_add =====');
		console.log(sql);
		console.log('===== need_add =====');
	
		connection.query(str, function (error, results, fields) {
		connection.end();
		if (error) {
			cbk_s(false); CP_s.exit = 1;
		}
		var v = {};

		for (var i=0; i < results.length; i++) {
			if (!v[results[i].vid])  v[results[i].vid] = [];
			if (v[results[i].vid].indexOf(results[i].node_ip) == -1) {
				v[results[i].vid][v[results[i].vid].length] = results[i].node_ip;
			}	
		}
		cbk_s(v);
	});
};

_f_s['NS0'] = function(cbk_s) { 
	var connection = mysql.createConnection(cfg0);
	connection.connect();
	var str = "SELECT `node_ip`  FROM `cloud_node`  " +
		 " WHERE `free` > 50 AND `score` < 1000 ORDER BY `free` ASC; ";
	connection.query(str, function (error, results, fields) {
		connection.end();
		if (!error) {
			var v = [];
			for (var i = 0; i < results.length; i++) {
				v[v.length] = results[i].node_ip;
			}
			cbk_s(v);
		} else cbk_s([]);
	});	
};
Array.prototype.diff = function (a) {
    return this.filter(function (i) {
        return a.indexOf(i) === -1;
    });
};
Array.prototype.shuffle = function() {
  var i = this.length, j, temp;
  if ( i == 0 ) return this;
  while ( --i ) {
     j = Math.floor( Math.random() * ( i + 1 ) );
     temp = this[i];
     this[i] = this[j];
     this[j] = temp;
  }
  return this;
}
_f_s['non_associated'] = function(cbk_s) { 
	var connection = mysql.createConnection(cfg0);
	connection.connect();
	var str = "SELECT `vid`, `server_ip`  FROM `video` WHERE `vid` NOT IN (SELECT `vid` FROM `video_node`)";
	connection.query(str, function (error, results, fields) {
		connection.end();
		if (!error) {
			var v = [];
			for (var i = 0; i < results.length; i++) {
				v[v.length] = results[i].vid;
			}
			cbk_s(v);
		} else cbk_s([]);
	});	
};

_f_s['NS2'] = function(cbk_s) { 

	var need_add = CP_s.data.need_add, non_associated =  CP_s.data.non_associated, ips = CP_s.data.NS0;
	var v = [];
	for (var o in need_add) {
		var ip_a = ips.diff(need_add[o]).shuffle().slice(0, 1 - need_add[o].length);
		for (var i = 0; i < ip_a.length; i++) {
			v[v.length] = "('" + ip_a[i] +"', '" + o + "', NOW())";
		}
	}
	
	for(var j = 0; j < non_associated.length; j++) {
		var ip_a = ips.shuffle().slice(0, 1);
		for (var i = 0; i < ip_a.length; i++) {
			v[v.length] = "('" + ip_a[i] +"', '" + non_associated[j] + "', NOW())";
		}	
	}
	
	if (v.length) {	
		var str = "INSERT INTO `video_node` (`node_ip`, `vid`, `updated`) VALUES " +  v.join(',') + 
		" ON DUPLICATE KEY UPDATE `vid` = `vid`";
		var connection = mysql.createConnection(cfg0);
		connection.connect();
		connection.query(str, function (error, results, fields) {	
			connection.end();
			cbk_s(true); 	
		});
	} else {	
		cbk_s(false); 
	}
};

CP_s.serial(
	_f_s,
	function(data_s) {
		console.log(data_s);
	},
	10000
);

