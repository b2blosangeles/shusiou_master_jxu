
try {
	var Ad =  React.createClass({
		getInitialState: function() {
			var me = this;
			return {text:_DATA_["/data/home_page.json"]};
		},	
		componentDidMount:function() {
			var me = this;
			$('.content_bg').find('video').attr('autoplay', true).attr('loop', true);
			// .attr('muted', false);
			
			$.ajax({
				url: shusiou_config.api_server + '/api/ad/get_default_ad.api',
				method: "POST",
				dataType: "JSON"
			}).done(function(data) {
				me.setState({adlist:data.data});
				me.playVideo();
			}).fail(function( jqXHR, textStatus ) {
			});			
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
		playVideo: function() {
			var me = this;
			var idx = Math.floor(Math.random()*me.state.adlist.length);
		//	var l = shusiou_config.api_server + '/api/video/shusiou_video_section.api?video='+me.state.adlist[idx].code+'|15|30';
			var l = 'http://' + me.state.adlist[idx].server_ip + '/api/video/play_stream.api?type=section&vid='+
			    me.state.adlist[idx].vid+'&s=30&l=30';
			$('.content_bg').find('video').attr("src", l);
		},
		render: function() {
			var me = this;
			return (
				<div className="content_section">
					<br/>
					<div className="container">
						
						<div className="col-sm-4 col-lg-4 col-md-4"> 
							<div className="overlayer_box">
								<h4 className="header">{me.dictionary('what_to_study')}</h4> 
								<p className="overlayer_box_body" style={me.textStyle()}
									dangerouslySetInnerHTML={{__html: me.getText('what_to_study')}} />
								<p> <a href="JavaScript:vpid(0)" onClick={me.playVideo.bind(me,{id:1})}
									    className="btn btn-md btn-danger bottom-adjust" >
										{me.dictionary('more_detail')}</a>									
								</p>
							</div>	
						</div>
						
						<div className="col-sm-4 col-lg-4 col-md-4"> 
							<div className="overlayer_box">
								<h4 className="header">{me.dictionary('how_to_study')}</h4> 
								<p className="overlayer_box_body"  style={me.textStyle()}
									dangerouslySetInnerHTML={{__html: me.getText('how_to_study')}} />
								<p> <a href="JavaScript:vpid(0)" onClick={me.playVideo.bind(me,{id:2})}
									    className="btn btn-md btn-warning bottom-adjust" >
										{me.dictionary('more_detail')}</a>
								</p>
							</div>	
						</div>
						
						<div className="col-sm-4 col-lg-4 col-md-4"> 
							<div className="overlayer_box">
								<h4 className="header">{me.dictionary('how_i_studied')}</h4> 
								<p className="overlayer_box_body"  style={me.textStyle()}
									dangerouslySetInnerHTML={{__html: me.getText('how_i_studied')}} />
								<p> <a href="JavaScript:vpid(0)" onClick={me.playVideo.bind(me,{id:3})}
									    className="btn btn-md btn-success bottom-adjust" >
										{me.dictionary('more_detail')}</a>
								</p>
							</div>	
						</div>						
					</div>	
					<div className="content_bg">
						<video src="" className="align-middle" muted></video>
					</div>
				</div>
			)
		}	
	});	
} catch (err) {
	console.log(err.message);
}
