(function () { 
	var obj =  function (env) {
		this.sendNamedIP = function(name, key, req, res) {
			let me = this;
			var mysql = require(env.site_path + '/api/inc/mysql/node_modules/mysql'),
	    		config = require(env.config_path + '/config.json'),
	    		cfg0 = config.db;
			let ips = [];
			var str = 'SELECT `node_ip` from `cloud_node` WHERE `score` < 900 ORDER BY `node_ip` ASC ';
			var connection = mysql.createConnection(cfg0);
			connection.connect();
			connection.query(str, function (error, results, fields) {
				connection.end();
				if (error) {
					return true;
				} else {
					if (results) {
						for (var i = 0; i < results.length; i++) {
							ips[ips.length] =  results[i].node_ip;
						}
					} else {
					}

				}
				me.send([{ 
					name: name,
					type: 'A',
					class: 'IN',
					ttl: 60,
					data: ips[key]
				}], req, res);
			});  			
		};
		this.send = function(v, req, res) {
			res.answer = v;	
			res.end();
		};
		this.sendRecord = function(req, res) {
			let me = this, question = req.question[0], 
			    patt = /^IP\_([0-9\_]+)\.shusiou\./ig, 
			    patt_t = /^T\_([0-9]+)\.shusilou\./ig, 
			    m;
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
				let T = patt_t.exec(question.name);
				if ((T) && (T[1])) {
					me.sendNamedIP(question.name, T[1], req, res);
				} else {
					me.send([{ 
						name: question.name,
						type: 'A',
						class: 'IN',
						ttl: 50,
						data: '192.241.135.153'
					}], req, res);				
				}
			}
		};	
	};
	module.exports = obj;
})();
// '192.241.135.143'
