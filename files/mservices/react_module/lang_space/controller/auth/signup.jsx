try {
	var Signup =  React.createClass({
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
				<span>
				<div className="container  body_section">
					<div class="row">

						<div className="col-md-2 col-lg-3 col-sm-1 hidden-xs"></div>
						<div className="login_form_box col-md-8  col-lg-6 col-sm-10  col-xs-12" 
							style={{'background-color':'#eee'}}>
							<form className="">
								<h3 className="text-center">{me.dictionary('login_form_signup')}</h3>
								
								{/*<label class="control-label text-info" for="email">
									 &nbsp;{me.dictionary('login_form_username')}
								</label>
								<div className="form-group">
									<input type="text" className="form-control input-lg" placeholder=""/>
								</div>
								
								<label class="control-label text-info" for="email">
									 &nbsp;{me.dictionary('login_form_username')}
								</label>
								<div className="form-group">
									<input type="text" className="form-control input-lg" placeholder=""/>
								</div>
								
								<label class="control-label text-info" for="email">
									 &nbsp;{me.dictionary('login_form_username')}
								</label>
								<div className="form-group">
									<input type="text" className="form-control input-lg" placeholder=""/>
								</div>
								
								<div className="form-group">
									<input type="password" className="form-control input-lg" placeholder={me.dictionary('login_form_password')}/>
								</div>
								<div className="form-group">
									<button type="button" className="btn btn-primary btn-lg btn-block">
										{me.dictionary('login_form_signin_button')}
									</button>
									<span><a href="#/Doc/Help">{me.dictionary('login_form_help')}?</a></span>
									<span className="pull-right"><a href="#/Signin">{me.dictionary('menu_login')}</a></span>
								</div>
								*/}
								<div className="form-group">
									<br/>
									{/*
									<div className="container-fluid additional_login_form_box">
										<div class="row">

											<div className="form-group">
												<button className="btn btn-warning btn-lg btn-block">Sign In with Facebook</button>
											</div>
											<div className="form-group">
												<button className="btn btn-warning btn-lg btn-block">Sign In with QQ</button>
											</div>							

										</div>
									</div>	
									*/}
								</div>
								
							</form>	
						</div>	
						<div className="col-md-2 col-lg-3 col-sm-1  hidden-xs"></div>
					</div>
				</div>	
				<div className="content_bg opacity_bg"></div>
				</span>	
			  );
		}	
	});	
} catch (err) {
	console.log(err.message);
}
