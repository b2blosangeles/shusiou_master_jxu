
try {
	var Signin =  React.createClass({
		getInitialState: function() {
			var me = this;
			return {};
		},	
		dictionary:function(v) {
			if (!this.props.route || !this.props.route.env ||!this.props.route.env.dictionary) return v;
			return this.props.route.env.dictionary(v);
		},
		handleChange:function(k,e) {
			var me = this, v = {};
			v[k] = e.target.value;
			me.setState(v);
			return true;
		},
		submitDisable:function(k,e) {
			var me = this;
			if (!me.state.username || !me.state.password || me.state.username.length < 3 || me.state.password.length < 3) return true;
			else return false;
		},
		submit:function() {
			var me = this;		
			$.ajax({
				url: shusiou_config.api_server + '/api/auth/auth.api',
				method: "POST",
				data: {cmd:'signin', username:me.state.username, password:me.state.password},
				dataType: "JSON"
			}).done(function( data) {
				if (data.data) {
					reactCookie.save('auth', data.data, { path: '/'});
					me.props.route.env.setState({auth:data.data},
						function() {
							// me.props.env.props.router.push('/');
							// me.componentDidMount();
							window.location.href = '/#/';
							window.location.reload();						
						});
				} else {
					me.setState({loginerr:'Login error! try again.'})
				}
			}).fail(function( jqXHR, textStatus ) {
				me.setState({loginerr:'Login error! try again.'})
			});			
		},	
		componentDidMount:function() {
			var me = this;
			if ((me.props.route.env.state.auth) && (me.props.route.env.state.auth.uid)) {
				me.props.router.push('/');
			}
		},		
		componentDidUpdate:function(prePropos, preState) {
			var me = this;
			// console.log(me.state);
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
								<h3 className="text-center">{me.dictionary('menu_login')}</h3>
								<div className="form-group">
									<input type="text" className="form-control input-lg" 
										value={me.state.username}
										onChange={this.handleChange.bind(this,'username')}
										placeholder={me.dictionary('login_form_username')}/>
								</div>
								<div className="form-group">
									<input type="password" className="form-control input-lg" 
										onChange={this.handleChange.bind(this,'password')}
										placeholder={me.dictionary('login_form_password')}/>
								</div>
								<div className="form-group">
									<button type="button" className="btn btn-primary btn-lg btn-block" 
										disabled={me.submitDisable()} onClick={me.submit.bind(me)}>
										{me.dictionary('login_form_signin_button')}
									</button>
									<span><a href="#/Doc/Help">{me.dictionary('login_form_help')}?</a></span>
									<span className="pull-right"><a href="#/Signup">{me.dictionary('login_form_signup')}</a></span>
								</div>
								<div className="form-group">
									<div style={{color:'red', height:'1em'}}>{me.state.loginerr}</div>
								</div>	
								{/*<div className="form-group">
									<br/>
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
								</div>*/}
								
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
