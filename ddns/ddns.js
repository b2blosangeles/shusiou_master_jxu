(function () { 
	var obj =  function (env) {
		this.queryIP = function(v) {
			let me = this;
			var mysql = require(env.site_path + '/api/inc/mysql/node_modules/mysql'),
	    		config = require(env.config_path + '/config.json'),
	    		cfg0 = config.db;
			return '192.241.135.149';
		};
		this.sendRecord = function(req, res) {
			let me = this, question = req.question[0], patt = /^IP\_([0-9\_]+)\.service\./ig, m;
			m = patt.exec(question.name);
			
			if ((m) && (m[1])) {
				let ip = m[1].replace(/\_/ig, '.');
				res.answer = [{ 
					name: question.name,
					type: 'A',
					class: 'IN',
					ttl: 50,
					data: ip
				}];				
			} else {
				res.answer = [{ 
					name: question.name,
					type: 'A',
					class: 'IN',
					ttl: 50,
					data: me.queryIP()
				}];
			}
			res.end();
		};	
	};
	module.exports = obj;
})();
// '192.241.135.143'
