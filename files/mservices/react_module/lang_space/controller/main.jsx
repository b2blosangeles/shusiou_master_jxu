try {	
	var shusiou_url = location.protocol+'//'+window.location.hostname;
	console.log(window.location.href.replace(shusiou_url, 'https://shusiou.com'))
	if (shusiou_url !== 'https://shusiou.com') {
	//	window.location.href = "https://shusiou.com";
	}
	var viewpoint = $('.'+mapping_data.id);	
	var { Router,
		  Route,
		  browserHistory,
		  createMemoryHistory,
		  hashHistory,
		  IndexRoute,
		  IndexLink,
		  Link } = ReactRouter;
	
	ReactDOM.render(
		<Root/>
		,
		viewpoint[0]
	);
} catch (err) {
	console.log('err.message===>');
	console.log(err.message);
}
