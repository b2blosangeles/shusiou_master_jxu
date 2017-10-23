
try {
	var ErrorPage =  React.createClass({
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
				<div className="content_section">
					<div className="container">
						<div class="row">
							<div className="col-sm-12 col-lg-12 col-md-12"> 
								<div className="overlayer_box editor_box">
									<h4 className="error_message">{me.dictionary('link_does_not_exist')}!</h4>
								</div>	
							</div>							
						</div>	
					</div>	
					<div className="content_bg opacity_bg"></div>
				</div>	
			)
		}	
	});	
} catch (err) {
	console.log(err.message);
}
