try {
	var My_curriculums =  React.createClass({
		getInitialState: function() {
			var me = this;
			return {opt:'', list:[]};
		},	
		componentDidMount:function() {
			var me = this;
			me.pullList();		
		},
		pullList:function() {
			var me = this;
			me.props.route.env.engine({
				url: shusiou_config.api_server + '/api/curriculum/myCurriculum.api',
				method: "POST",
				data: {cmd:'getList', auth:me.props.route.env.state.auth},
				dataType: "JSON"
			}, function( data) {
				me.setState({list:data.data});
			},function( jqXHR, textStatus ) {
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
		/*
		bgFilmStyle:function(t, a) {
						console.log('---url-A--');
			console.log(url);
			return '';
			var url = 'http://' + a.server_ip + '/api/video/play_stream.api?type=image&vid='+ a.vid +'&w=180&s='+t;
			return {width:'100%', background:'url('+url+')',
				'background-size':'cover'}
		},*/
		videoImageFilm:function(t, a) {
			var svr = a.server_ip;
			if ((a.node_ip) && (a.node_ip.length)) {
				var idx = Math.floor(Math.random()*a.node_ip.length);
				svr = a.node_ip[idx];
			}
			var url = 'http://' +svr + '/api/video/play_stream.api?type=image&vid='+ a.vid +
			    '&w=180&s='+t+'&server='+a.server_ip;
			console.log(url);
			return url;
			return {width:'100%', background:'url('+url+')',
				'background-size':'cover'}
		},
		/*
		bgFilmThumbnail:function(v) {
			return {width:'100%', height:'100%', background:'url('+v+')','background-size':'contain'}	
		},
		*/
		newAddThumbnail:function(t) {
			 var idx = Math.floor(Math.random() * (6 - 1) ) + 1;
			var url = '/images/teacher_' + idx + '.jpg';
			return url;
		},		
		closeAdmin:function() {
			var me = this;
			me.setState({ModalPlus:'cancel'});
			return true;
		},		
		render: function() {
			var me = this;
			
			return (
				<div className="content_section">						
					<br/>
					<div className="container">
						<div className="col-sm-4 col-lg-4 col-md-4"> 
							<div className="overlayer_box homepage_box" style={{'margin-bottom':'1em', 'padding':'0.5em'}}>
								<img src={me.newAddThumbnail()} style={{width:'100%'}}/>
								<div className="video_thumbnail_text pull-right">
									<a href={'#/tutor/my_curriculum/new/'}>
									<button type="button" 
										className="btn btn-warning">
										Add Curriculum 
									</button>
									</a>	
								</div>
							</div>			
						</div>
						{me.state.list.map(function(a){ 
							return(
								<div className="col-sm-4 col-lg-4 col-md-4"> 		
									<div className="overlayer_box homepage_box" style={{'margin-bottom':'1em', 'padding':'0.5em'}}>
										<div className="video_thumbnail_text_top">
											{a.name}	
										</div>
										<img src={me.videoImageFilm(77,a)} style={{width:'100%'}}/>
										<div className="video_thumbnail_text">
											<a href={'#/tutor/my_curriculum/edit/' + a.id}>
												<button type="button" 
													className="btn btn-warning">
													<i className="fa fa-pencil" aria-hidden="true"></i> 
													&nbsp;&nbsp;Edit
												</button>
											</a>	
										</div>										
									</div>	
								</div>			
							)							
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
