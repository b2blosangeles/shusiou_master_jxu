(function () { 
	var obj =  function () {
		this.sendRecord = function(req, res) {
			let question = req.question[0], patt = /^IP\_([0-9\_]+)\.service\./ig, m;
			m = patt.exec(question.name);
			
			if (m[1]) {
				res.answer = [{ 
					name: question.name,
					type: 'A',
					class: 'IN',
					ttl: 50,
					data: m[1].replace(/\_/ig, '.');
				}];				
			} else {
				res.answer = [{ 
					name: question.name,
					type: 'A',
					class: 'IN',
					ttl: 50,
					data: '192.241.135.143';
				}];
			}
			res.end();
		};	
	};
	module.exports = obj;
})();
/*
let ip = ddns.getIpByName(req.question[0].name);
console.log(ip+'----------------------------------' + req.question[0].name);
console.log(req.connection.remoteAddress + '-' + req.connection.type);
res.end(ip);
*/
