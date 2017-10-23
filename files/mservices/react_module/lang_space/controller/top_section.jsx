
try {
	var Topsection =  React.createClass({
		getInitialState: function() {
			var me = this;
			return {list: [], hash:window.location.hash};
		},
		role:function(route) {
			var m = this.props.env.matrix;
			for (var i = 0; i < m.length; i++) {
				if (m[i].route == route) {
					return m[i].role;
				}
			}
			return ['*'];
		},
		inte_array: function(a, b) {
			for(var i=0; i < a.length; i++) { if (b.indexOf(a[i]) !== -1) return true;}
			return false;
		},
		myRoles : function() {
			var me = this;
			var my_role = ((me.props.env.state.auth) && (me.props.env.state.auth.roles))?me.props.env.state.auth.roles:[];
			if (my_role.length) return (
				<span>
					[{my_role.map(function(r) {
						return me.props.env.state.roles[r][me.props.env.state.c_lang] + ' ';	
					})}]
				</span>);
		},
		roleMenu: function(c_role)  {
			var me = this;
			var my_role = ((me.props.env.state.auth) && (me.props.env.state.auth.roles))?me.props.env.state.auth.roles:[];
			
			var m = [ 
			//	{code:'what_to_study', router:'what_to_study'},
			//	{code:'how_to_study', router:'how_to_study'},
				{code:'public_courses', router:'public_courses'},
				{code:'my_course', role:['learner'], router:'student/my_courses'},
			//	{code:'menu_tuition', router:'student/my_qna'},
				{code:'my_videos', router:'tutor/my_videos'},
				{code:'my_curriculums', router:'tutor/my_curriculums'}
			];			
			
			return m.map(function (item) {
				var role = me.role(item.router);
				if  (me.inte_array(my_role,role) || me.inte_array(['*'],role))
					return  <li><a className={me.isActive(item.code)} href={'/#/'+item.router}>{me.dictionary(item.code)}</a></li>
			});		
		},
		docviwer:function(data) {
			return (
				<Docviwer data={data}/>
			)
		},
		loading:function() {
			var me = this;
			me.setState({ModalLoading: {textcolor:'#000000', hold:1000, 
				message:'<img src="https://i.stack.imgur.com/oQ0tF.gif" width="24">'}});
			setTimeout(
				function() {
					me.setState({ModalLoading: 'cancel'});	
				}, 5000
			)
		},
		alert:function() {
			var me = this;
			me.setState({ModalPlus: {type:'alert', body_class:'warning', 
			 box_style:{border:'1px solid red'},
			 message:'nice <span style="color:red">job</span> ok'}});	
		},
		popup:function() {
			var me = this;
			me.setState({ModalPlus: {type:'popup', style:'info', backdrop:{bg:'#ff0000', opacity:0.1},
				body: me.docviwer({title:'title', body:'test body'})}});
		},
		lock:function(e) {
			if ((e.target) && $(e.target) && ($(e.target)[0])) {
				var obj = $(e.target);
				obj.attr('disabled', true);
			}
		},	
		release:function(e) {
			if ((e.target) && $(e.target) && ($(e.target)[0])) {
				var obj = $(e.target);
				obj.attr('disabled', false);
			}
		},	
		loadData:function(d, e) {
			console.log(e);
			var me = this;
			me.lock(e);

			me.setState({ModalLoading: {textcolor:'#fff', hold:100,
				message:'<img src="https://i.stack.imgur.com/oQ0tF.gif" width="24">'}});	

			$.get('http://m.qalet.com/api/newsfeed/wxct/wxct_list.js',
			{}, 
			function (data) {

				me.setState({ModalPlus: {type:'alert', style:'success', message:'saved B'}});
				setTimeout(
					function() {
						me.setState({ModalLoading: 'cancel'});	
					},12000

				);
				me.setState({list: data }, function() {
					me.release(e);
				});
			},'json');
		},
		isActive:function(v) {
			var k = this.state.hash;
			if (v == k.replace(/\#\//,'')) {
				return 'active';
			}
		},
		setLang:function(v) {
			this.props.env.setLang(v);
		},		
		dictionary:function(v) {
			if (!this.props.env || !this.props.env.dictionary) return v;
			return this.props.env.dictionary(v);
		},		
		componentDidMount:function() {
			var me = this;
			$('title').html(me.dictionary('site_name'));
			window.addEventListener("hashchange", function() {
				me.setState({hash:window.location.hash});
			}, false);
		},
		componentDidUpdate:function(prevProps, prevState) {
			var me = this;	
			$('title').html(me.dictionary('site_name'));
			if (JSON.stringify(prevState) !== JSON.stringify(me.state)) {
			}
		},
		authItem:function() {
			var me = this;
			if ((me.props.env.state.auth) && (me.props.env.state.auth.uid)) { return(	
				<li className="dropdown">
					<a href="JavaScript:void(0)" className="dropdown-toggle" data-toggle="dropdown"
					>{(me.props.env.state.auth.name)?me.props.env.state.auth.name:'Guest'}
					<span className="caret"></span></a>
					<ul className="dropdown-menu">
						<li><a href="JavaScript:void(0);" onClick={me.signOut.bind(me)}>{me.dictionary('menu_logout')}</a></li>
					</ul>	 
				</li>   
			
			) } else {return (
				<li><a href="#/Signin">{me.dictionary('menu_login')}</a></li>
			)};
		},		
		signOut:function() {
			var me = this;	
			$.ajax({
				url: shusiou_config.api_server + '/api/auth/auth.api',
				method: "POST",
				data: {cmd:'signout',data:me.props.env.state.auth},
				dataType: "JSON"
			}).done(function( data) {
				if (data.data) {
					// console.log(data);
					reactCookie.remove('auth', { path: '/'});
					me.props.env.setState({auth:null},
						function() {
							// me.props.env.props.router.push('/');
							me.componentDidMount();
							window.location.href = '/#/'
						});
					
				//	window.location.href = '/#/';
					// window.location.reload();
				}	
			}).fail(function( jqXHR, textStatus ) {
			});				
		},		
		render: function() {
			var me = this;		
			return (
				<span><br/><br/><br/>
					<nav className="navbar navbar-default navbar-fixed-top header_section">
					  <div className="container-fluid">
						<div className="navbar-header">
						  <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
						<span className="sr-only">Toggle navigation</span>
						<span className="icon-bar"></span>
						<span className="icon-bar"></span>
						<span className="icon-bar"></span>
						  </button>
						  <a className="navbar-brand" href="#"><b>{me.dictionary('site_legal_name')}</b></a>
						</div>

						<div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
						  <ul className="nav navbar-nav">
							{me.roleMenu(me.props.env.state.c_role)}						  
						  </ul>
						  <ul className="nav navbar-nav navbar-right">  
							{me.authItem()}
							<li className="dropdown">
								<a>{me.myRoles()}</a>
							</li>							  
							<li className="dropdown">
							  <a href="JavaScript:void(0);" className="dropdown-toggle" data-toggle="dropdown" 
								  role="button" aria-haspopup="true" aria-expanded="false">{me.dictionary('menu_language')}<span className="caret"></span></a>
							  <ul className="dropdown-menu">
								{
									Object.keys(me.props.env.state.lang).map(function (key) {
										if (key != me.props.env.state.c_lang) {
											return  <li><a href="JavaScript:void(0);" onClick={me.setLang.bind(me,key)}>
												{me.props.env.state.lang[key]}
											</a></li>
										}
									})					  
								}
							  </ul>
							</li>
						  </ul>
						</div>
					  </div>
					</nav>			

				</span>
			  );
		}	
	});	
} catch (err) {
	console.log(err.message);
}

