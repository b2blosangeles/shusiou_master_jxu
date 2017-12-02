(function () { 
	var obj =  function (env, pkg, req) {
		var mysql = require(env.site_path + '/api/inc/mysql/node_modules/mysql'),
		config = require(env.config_path + '/config.json'),
		cfg0 = config.db;	
		var connection = mysql.createConnection(cfg0);
		this.getUid = function(callback) {
			if (req.body.auth && req.body.auth.uid) {
				connection.connect();
				connection.end();				
				callback({isAuth:true, uid:req.body.auth.uid});
			} else {
				callback({isAuth:false});	
			}
		}	
	};
	module.exports = obj;
})();
