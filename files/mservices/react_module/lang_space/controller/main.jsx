try {	
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
