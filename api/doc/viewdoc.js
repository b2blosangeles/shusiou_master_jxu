// res.send(env); var url = (req.query.md)?req.query.md:req.post.md;
var source = {
	Aboutus:	{title:'menu_aboutus', fn:'Aboutus.html'},
	Contact:	{title:'menu_contact', fn:'Contact.html'},
	QNA:		{title:'menu_qna', fn:'QNA.html'},
	Help:		{title:'menu_help', fn:'Help.html'},
	Testimony:	{title:'menu_testimony', fn:'Testimony.html'},
	Privacy:	{title:'menu_privacy', fn:'Privacy.html'},
	Terms:		{title:'menu_terms', fn:'Terms.html'}
}



if (!source[req.body.code]) {
	res.send({title: req.body.code, body:' Undefined document <b>' +req.body.code+ '</b>!!'});
} else {
	var fn = 'document/' + req.body.lang + '/' + source[req.body.code].fn,
	fn0 = 'document/en/' + source[req.body.code].fn;
res.send(fn);
	return true;
	pkg.fs.readFile(env.site_path + fn, 'utf8', function(err, contents) {
		if (err) {
			pkg.fs.readFile(env.site_path + fn0, 'utf8', function(err, contents) {
				if (err) {
					res.send({
						title: (source[req.body.code])?(source[req.body.code].title):req.body.code,
						body:'File ' + fn + ' does not exist!'
					});		   
				} else {
					res.send({
						title: (source[req.body.code])?(source[req.body.code].title):req.body.code,
						body: contents
					});
				}
			});		   
		} else {
			res.send({
				title: (source[req.body.code])?(source[req.body.code].title):req.body.code,
				body: contents
			});
		}
	});
	
}
