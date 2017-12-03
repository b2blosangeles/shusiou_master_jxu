(function () { 
	var obj =  function (env, pkg, req, app) {
		var mysql = require(env.site_path + '/api/inc/mysql/node_modules/mysql'),
		config = require(env.config_path + '/config.json'),
		cfg0 = config.db;	
		var connection = mysql.createConnection(cfg0);
		this.getUid = function(callback) {
			if ((req.body.auth) && (req.body.auth.uid)  && (req.body.auth.token)) {
				connection.connect();
				var str = "SELECT `uid` FROM `auth_session` "+    
				" WHERE `uid` = '" + req.body.auth.uid + "' AND `token` = '" + req.body.auth.token + "';";
				connection.query(str, function (error, results, fields) {
					connection.end();
					if (error) {
						callback({isAuth:false});
					} else if (results.length) { 
						callback({isAuth:true, uid:req.body.auth.uid});
					} else {
						callback({isAuth:false});
					}
				});  
			} else {
				callback({isAuth:false});	
			}
		}	
	};
	module.exports = obj;
})();
