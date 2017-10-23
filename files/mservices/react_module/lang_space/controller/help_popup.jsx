try {
	var HelpPopup =  React.createClass({
		getInitialState: function() {
			return {body:''};	
		},
		loadUrl:function() {
			var me = this;
			$.ajax({
				url: me.props.url,
				method: "GET",
				data: { },
				dataType: "html"
			}).done(function( data) {
				me.setState({body:data})
			});		
		},
		componentDidMount:function() {	
			var me = this;
			me.loadUrl();

		},
		componentDidUpdate:function(prePropos, preState) {
			var me  = this;
			if (me.props.url != prePropos.url) {
				me.loadUrl();
			}
		},		
		render: function() {
			var me = this;
			return (
				<span dangerouslySetInnerHTML={{__html: me.state.body}} />	
			)
		}	
	});	
} catch (err) {
	console.log(err.message);
}
