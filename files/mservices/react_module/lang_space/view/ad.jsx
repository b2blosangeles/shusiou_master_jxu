
try {
	var Ad =  React.createClass({
		getInitialState: function() {
			var me = this;
			return {text:{}};
		},	
		componentDidMount:function() {
			var me = this;
			$('.content_bg').find('video').attr('autoplay', true).attr('loop', true);
			// .attr('muted', false);
			// shusiou_config.api_server + 
			$.ajax({
				url: '/api/ad/get_default_ad.api',
				method: "POST",
				dataType: "JSON"
			}).done(function(data) {
				me.setState({adlist:data.data});
				me.playVideo();
			}).fail(function( jqXHR, textStatus ) {
			});
			
			$.ajax({
				url: '/api/content_data/shusiou_data.api',
				method: "POST",
				dataType: "JSON",
				data:{lang:null, group:['home_page']}
			}).done(function(data) {
				me.setState({text:data});
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
			return this.state.text[this.getCurrentLanguage() + '/home_page/'+v];
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
			//var l = 'http://' + me.state.adlist[idx].node_ip + '/api/video/play_stream.api?type=section&vid='+
			//    me.state.adlist[idx].vid+'&s=30&l=30&server=' + me.state.adlist[idx].server_ip;
			var l = 'http://198.199.120.18/api/video/pipe_stream.api?video_fn=' + me.state.adlist[idx].vid +
				'&ss=30&t=30';
			//var l = 'https://nd1.service.shusiou.win/api/video/play_stream.api?type=section&vid='+
			//    me.state.adlist[idx].vid+'&s=30&l=30&server=' + me.state.adlist[idx].server_ip;			
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
