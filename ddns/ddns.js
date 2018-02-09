(function () { 
	var obj =  function (env) {
		this.sendNamedIP = function(v, req, res) {
			let me = this;
			var mysql = require(env.site_path + '/api/inc/mysql/node_modules/mysql'),
	    		config = require(env.config_path + '/config.json'),
	    		cfg0 = config.db;
			/*
			let ips = [];
			var str = 'SELECT `node_ip` from `cloud_node` ORDER BY score ASC';
			var connection = mysql.createConnection(cfg0);
			connection.connect();
			connection.query(str, function (error, results, fields) {
				connection.end();
				if (error) {
					cbk(error.message);
					return true;
				} else {
					if (results) {
						cbk(queryStringToJSON(results[0].script, []));
					} else {
						cbk(false);
					}

				}

			});  			
			*/
			me.send([{ 
				name: v,
				type: 'A',
				class: 'IN',
				ttl: 60,
				data: '192.241.135.159'
			}], req, res);
		};
		this.send = function(v, req, res) {
			res.answer = v;	
			res.end();
		};
		this.sendRecord = function(req, res) {
			let me = this, question = req.question[0], patt = /^IP\_([0-9\_]+)\.service\./ig, m;
			m = patt.exec(question.name);
			
			if ((m) && (m[1])) {
				let ip = m[1].replace(/\_/ig, '.');
				me.send([{ 
					name: question.name,
					type: 'A',
					class: 'IN',
					ttl: 50,
					data: ip
				}], req, res);				
			} else {
				me.sendNamedIP(question.name, req, res);
			}
		};	
	};
	module.exports = obj;
})();
// '192.241.135.143'
