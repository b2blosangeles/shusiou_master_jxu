(function () { 
	var obj =  function () {
		this.sendRecord = function(req, res) {
			let question = req.question[0], patt = /^IP\_([0-9\_]+)\.service\./ig, m;
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
					data: null
				}];
			}
			res.end();
		};	
	};
	module.exports = obj;
})();
// '192.241.135.143'
