try {	
	var My_videos =  React.createClass({
		getInitialState: function() {
			var me = this;
			return {opt:'', list:[]};
		},	
		componentDidMount:function() {
			var me = this;
			me.pullList();
		},
		componentDidUpdate:function() {
			var me = this;
			// me.dataApi();
			consoli.log(me.state.opt);
			
		},
		pullList:function() {
			var me = this;
			$.ajax({
				url:  '/api/video/myVideo.api?opt=getMyVideos',
				method: "POST",
				data: {auth:me.props.route.env.state.auth},
				dataType: "JSON"
			}).done(function( data) {
				if (data.status == 'success') {
					me.setState({list:data.data});
				}	
			}).fail(function( jqXHR, textStatus ) {
				console.log('error');
			});			
		},
		componentDidUpdate:function() {
			var me = this;
		},		
		dictionary:function(v) {
			if (!this.props.route || !this.props.route.env ||!this.props.route.env.dictionary) return v;
			return this.props.route.env.dictionary(v);
		},
		getCurrentLanguage: function() {
			return this.props.route.env.getCurrentLanguage();	
		},
		getText:function(v) {
			return this.state.text[v][this.getCurrentLanguage()];
		},
		textStyle:function() {
			var me = this;
			if (me.props.route.env.state.Breakpoint == 'sm' || me.props.route.env.state.Breakpoint == 'sx') {
				return {'font-size':'0.8em'}
			} else {
				return {'font-size':'1em'}	
			}
		},		
		bgFilmStyle:function(t, a) {
			if (!a.space_status) {
				
				var url = 'http://' + a.server_ip + '/api/video/play_stream.api?type=image&vid='+ a.vid +'&w=180&s='+t;
			} else {
				
				var url = 'https://nd'+ (Math.floor(Math.random() * a.dns_matrix) + 1) + 
				    '.service.shusiou.win' +  '/api/video/pipe.api?video_fn='+ a.vid +'&size=320&ss='+t;
			}
			return {width:'100%', background:'url('+url+')',
				'background-size':'cover'}
		},
		bgFilmThumbnail:function(v) {
			return {width:'100%', height:'100%', background:'url('+v+')','background-size':'contain'}	
		},		
		bgFilmAddStyle:function(t) {
			var url = '/images/movie_add.png';
			return {width:'100%', background:'url('+url+')',
				'background-repeat':'no-repeat',
			       'background-position':'center',
			       'background-color':'lightyellow'
			       }
		},
		closeAdmin:function(v) {
			var me = this;
			me.setState({ModalPlus:'cancel'});			
			return true;
		},
		gotoAdmin:function(v) {
			var me = this;
			var id = new Date().getTime();
			me.setState({ModalPlus:{type:'popup',  hold:0,
				box_style:{top:'28px'},
				title: (<span>Add a Video</span>),
				message: (<My_video_admin parent={me} id={me.state.popup_id}/>),
				header:(<My_video_admin_header parent={me} id={me.state.popup_id}/>),
				footer:(<My_video_admin_footer parent={me} id={me.state.popup_id}/>)
			}});			
			return true;
		},
		videoInfo:function(rec){
			var me = this;
			var id = new Date().getTime();
			me.setState({ModalPlus:{type:'popup',  hold:0,
				box_style:{top:'28px'},
				title: (<span></span>),
				message: (<Popup_my_video_info parent={me} rec={rec} id={me.state.popup_id}/>),
				header:(<span></span>),
				footer:(<span/>)
			}});
			return true;
		},			
		videoDelete:function(vid){
			var me = this;
			$.ajax({
				url: '/api/video/myVideo.api?opt=removeUserVideo',
				method: "POST",
				data: {vid:vid, auth: me.props.route.env.state.auth},
				dataType: "JSON"
			}).done(function( data) {
				me.pullList();
			}).fail(function( jqXHR, textStatus ) {
				// me.pullList();
			});
		},		
		render: function() {
			var me = this;
			
			return (
				<div className="content_section">	
					<br/>
					<div className="container">
						<div className="col-sm-4 col-lg-4 col-md-4"> 
							<div className="overlayer_box homepage_box" style={{'margin-bottom':'1em', 'padding':'0.5em'}}>
								<a href="JavaScript:void(0)" onClick={me.gotoAdmin.bind(me,'admin')}>
								<img src="/images/film_bg.png" style={me.bgFilmAddStyle()} />
								</a>	
							</div>			
						</div>
						{me.state.list.map(function(a){ 
							if (a.status == 'ready') return(
							<div className="col-sm-4 col-lg-4 col-md-4"> 
								<div className="overlayer_box homepage_box" style={{'margin-bottom':'1em', 'padding':'0.5em'}}>
									<div className="video_thumbnail_icon_group">
										<button type="button" className="btn btn-danger"
											onClick={me.videoInfo.bind(me,a)}>
											<i className="fa fa-play" aria-hidden="true"></i>
										</button>										
									</div>
									<img src="/images/film_bg.png" style={me.bgFilmStyle(6, a)} />
								</div>

							</div>							
							)
							else return(
							<div className="col-sm-4 col-lg-4 col-md-4"> 
								<div className="overlayer_box homepage_box" style={{'margin-bottom':'1em', 'padding':'0.5em'}}>
									<img src="/images/film_bg.png" style={me.bgFilmThumbnail(a.org_thumbnail)} />	
									<div className="video_thumbnail_text video_thumbnail_text_bg pull-right">
										<i className="fa fa-info-circle"></i> {(a.message)?a.message:'Pulling ...'}
									</div>
								</div>

							</div>							
							);							
						})}							
					</div>						

					<br/><br/><br/><br/>
					<ModalPlus parent={me} />
					<div className="content_bg opacity_bg">

					</div>	
				</div>
			);
		}
	});	
	
} catch (err) {
	console.log(err.message);
}
