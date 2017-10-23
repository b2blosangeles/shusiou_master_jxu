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
				url: shusiou_config.api_server + '/api/shusiou_curriculum.js',
				method: "POST",
				data: {cmd:'getList'},
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
		bgFilmStyle:function(t, a) {
			var url = shusiou_config.api_server + '/api/shusiou_video_image180.js?video='+a+'|'+t;
			return {width:'100%', background:'url('+url+')',
				'background-size':'cover'}
		},
		videoImageFilm:function(a, t) {
			var url = shusiou_config.api_server + '/api/shusiou_video_image180.js?video='+a+'|'+t;
			return url;
		},		
		bgFilmThumbnail:function(v) {
			return {width:'100%', height:'100%', background:'url('+v+')','background-size':'contain'}	
		},
		
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
										<img src={me.videoImageFilm(a.code, 10)} style={{width:'100%'}}/>
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
