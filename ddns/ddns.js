(function () { 
	var obj =  function (env, ns_ip) {
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
			    patt = {
				    ip: /^IP\_([0-9\_]+)\.shusiou\./ig,
				    idx:/^IDX([0-9]+)\.shusiou\./ig,
				    www:/^(www\.|)shusiou\./ig
			    },	    
			    mh = '', m;
			
			for (var key in patt) {
				if (patt[key].test(question.name)) {
					mh = key;
					break;
				}
			}
			switch (mh) {
				case 'ip': 
					m = new RegExp(patt[mh]).exec(question.name);
					me.send([{ 
						name: question.name,
						type: 'A',
						class: 'IN',
						ttl: 60,
						data: m[1].replace(/\_/ig, '.')
					}], req, res);				
					break;
				case 'idx': 
					m = new RegExp(patt[mh]).exec(question.name);
					me.sendNamedIP(question.name, m[1], req, res);
					break;	
				case 'www': 
					me.send([{ 
						name: question.name,
						type: 'A',
						class: 'IN',
						ttl: 60,
						data: ns_ip
					}], req, res);				
					break;
				default:
					me.send([{ 
						name: question.name,
						type: 'A',
						class: 'IN',
						ttl: 60,
						data: null
					}], req, res);					
			}
		};	
	};
	module.exports = obj;
})();
// '192.241.135.143'
