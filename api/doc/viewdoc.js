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
	var fn = '/document/' + req.body.lang + '/' + source[req.body.code].fn;
	
	pkg.fs.readFile(env.site_contents_path + fn, 'utf8', function(err, contents) {
		if (err) {
			pkg.fs.readFile(env.site_contents_path + fn, 'utf8', function(err, contents) {
				if (err) {
					res.send({
						env:env,
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
