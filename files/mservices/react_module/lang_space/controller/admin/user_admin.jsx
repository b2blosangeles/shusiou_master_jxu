
try {
	var UserAdmin =  React.createClass({
		getInitialState: function() {
			var me = this;
			return {};
		},	
		dictionary:function(v) {
			if (!this.props.route || !this.props.route.env ||!this.props.route.env.dictionary) return v;
			return this.props.route.env.dictionary(v);
		},	
		render: function() {
			var me = this;		
			return (
				<div className="container  body_section">
					<div class="row">
						<div className="jumbotron container">
						  <h3 className="display-3">{me.dictionary('menu_useradmin')}</h3>
						  <p className="lead"></p>
						  <hr className="my-4"/>
						  <p></p>
						  <p className="lead">
							<a className="btn btn-primary btn-lg" href="#" role="button">Learn more</a>
						  </p>
						</div>
					</div>
				</div>	
			  );
		}	
	});	
} catch (err) {
	console.log(err.message);
}
