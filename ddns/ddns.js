(function () { 
	var obj =  function (env, ns_ip) {
		this.validateIPaddress = function (ip)  {
			let patt = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
			return (patt.test(ip)) ?  true : false;
  		}		
		this.sendNamedIP = function(name, key, req, res) {
			let me = this, k;
			 if (isNaN(key) || key === '0') { 
			 	res.end(); 
				return true;
			} else {
				k = parseInt(key) - 1;
			}
		
			if (!env.dns_matrix) {
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
					env.dns_matrix = ips;
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
					data: env.dns_matrix[k]
				}], req, res);			
			}
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
				    mp:/sp([0-9]+)\.service\./ig,
				    md:/sd([0-9]+)\.service\./ig
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
				case 'md':
				case 'mp':	
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
