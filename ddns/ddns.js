(function () { 
	var obj =  function (env, ns_ip) {
		this.validateIPaddress = function (ip)  {
			let patt = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
			return (patt.test(ip)) ?  true : false;
  		}		
		this.sendNodeNamedIP = function(name, key, req, res) {
			let me = this, k;
			 if (isNaN(key) || key === '0') { 
			 	res.end(); 
				return true;
			} else {
				k = parseInt(key) - 1;
			}
		
			if (!env.node_matrix) {
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
					env.node_matrix = ips;
					me.send([{ 
						name: name,
						type: 'A',
						class: 'IN',
						ttl: 60,
						data: ips[k]
					}], req, res);
				});
			} else {
				me.send([{ 
					name: name,
					type: 'A',
					class: 'IN',
					ttl: 60,
					data: env.node_matrix[k]
				}], req, res);			
			}
		};
		this.sendMasterNamedIP = function(name, key, req, res) {
			let me = this, k;
			 if (isNaN(key) || key === '0') { 
			 	res.end(); 
				return true;
			} else {
				k = parseInt(key) - 1;
			}
		
			if (!env.master_matrix) {
				var mysql = require(env.site_path + '/api/inc/mysql/node_modules/mysql'),
				config = require(env.config_path + '/config.json'),
				cfg0 = config.db;
				let ips = [];
				var str = 'SELECT `server_ip` from `cloud_server` WHERE 1 ORDER BY `server_ip` ASC ';
				var connection = mysql.createConnection(cfg0);
				connection.connect();
				connection.query(str, function (error, results, fields) {
					connection.end();
					if (error) {
						return true;
					} else {
						if (results) {
							for (var i = 0; i < results.length; i++) {
								ips[ips.length] =  results[i].server_ip;
							}
						} else {
						}

					}
					env.master_matrix = ips;
					
					me.send([{ 
						name: name,
						type: 'A',
						class: 'IN',
						ttl: 60,
						data: ips[0]
					}], req, res);
					// data: ips[k]
				});
			} else {
				me.send([{ 
					name: name,
					type: 'A',
					class: 'IN',
					ttl: 60,
					data: env.master_matrix[0]
				}], req, res);			
			}
			// data: env.master_matrix[k]
		};		
		this.send = function(v, req, res) {
			let me = this;
			v.data =  (me.validateIPaddress(v.data)) ? v.data : null;
			res.answer = v;	
			res.end();
		};
		
		this.sendRecord = function(req, res) {
			let me = this, question = req.question[0], 
			    patt = {
				    ip: /^IP\_([0-9\_]+)\.service\./ig,
				    idx:/node([0-9]+)\.service\./ig,
				    np:/np([0-9]+)\.service\./ig,
				    nd:/nd([0-9]+)\.service\./ig,
				    mp:/mp([0-9]+)\.service\./ig,
				    md:/md([0-9]+)\.service\./ig
			    },	    
			    mh = '', m;
			
			/* -- for special domain */
			delete require.cache[env.site_path + '/ddns/specialDomain.json'];
			this.specialNames = require(env.site_path + '/ddns/specialDomain.json');
			if (me.specialNames[question.name]) {
				me.send([{ 
					name: question.name,
					type: 'A',
					class: 'IN',
					ttl: 60,
					data: me.specialNames[question.name]
				}], req, res);	
				return true;
			}
			/* -- for special domain end */
			
			for (var key in patt) {
				if (patt[key].test(question.name)) {
					mh = key;
					break;
				}
			}
			switch (mh) {
				case 'ip': 
					m = new RegExp(patt[mh]).exec(question.name);
					let ip = m[1].replace(/\_/ig, '.');
					me.send([{ 
						name: question.name,
						type: 'A',
						class: 'IN',
						ttl: 60,
						data: ip
					}], req, res);
					break;
				case 'idx': 
				case 'nd':
				case 'np':
					m = new RegExp(patt[mh]).exec(question.name);
					me.sendNodeNamedIP(question.name, m[1], req, res);
					break;						
				case 'md':
				case 'mp':	
					m = new RegExp(patt[mh]).exec(question.name);
					me.sendMasterNamedIP(question.name, m[1], req, res);
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
