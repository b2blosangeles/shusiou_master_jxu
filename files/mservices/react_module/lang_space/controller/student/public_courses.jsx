try {
	var PublicCourses =  React.createClass({
		getInitialState: function() {
			var me = this;
			return { video:{}, list:[]};
		},	
		componentDidMount:function() {
			var me = this;
			me.getDataApi();
			var str='test1[s]test2';
			var a = str.split(/\[s\]/i);
		},
		getDataApi: function(opt) {
			var me = this, A = me.state.list;
			$.ajax({
				url: 'https://www.qalet.com/api/curriculum/curriculums.api',
				method: "POST",
				data: {cmd:'getPublicList'},
				dataType: "JSON"
			}).done(function( data) {
				console.log(data.data);
				me.setState({list:data.data});
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
		videoImageFilm:function(a, t) {
			var url = 'http://' + a.server_ip + '/api/video/play_stream.api?type=image&vid='+ a.vid +
			    '&w=180&s='+t+'&server='+a.server_ip;			
			return url;
		},
		bgFilmStyle:function(t) {
			var url = 'http://shusiou.com/api/lang_space/video_image.api?video=sample.mp4|'+t;
			return {width:'100%', background:'url('+url+')',
				'background-size':'cover'}
		},		
		render: function() {
			var me = this;
			return (
				<div className="content_section">
					<br/>
					<div className="container">

						{me.state.list.map(function(a){ 
							return(
								<div className="col-sm-4 col-lg-4 col-md-4"> 		
									<div className="overlayer_box homepage_box" style={{'margin-bottom':'1em', 'padding':'0.5em'}}>
										<div className="video_thumbnail_text_top">
											{a.name}	
										</div>
										<img src={me.videoImageFilm(a, 10)} style={{width:'100%'}}/>
										<div className="video_thumbnail_text">
											<a href={'#/student/my_course/' + a.curriculum_id}>
												<button type="button" 
													className="btn btn-success">
													<i className="fa fa-play" aria-hidden="true"></i> 
													&nbsp;&nbsp;play
												</button>
											</a>	
										</div>										
									</div>	
								</div>			
							)							
						})}										
					</div>	
					
					<br/>					
					
					<br/><br/><br/><br/>
					
					<div className="content_bg opacity_bg">					
					</div>	
				</div>
			)
		}
	});	
	
} catch (err) {
	console.log(err.message);
}
