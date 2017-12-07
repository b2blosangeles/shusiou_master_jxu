try {
	var Embed_curriculum_preview =  React.createClass({
		getInitialState: function() {
			var me = this;
			return {};
		},	
		componentDidMount:function() {
			var me = this;
			if (me.props.params.opt == 'new') {
				me.getVideos();
				me.props.parent.getVideoInfo(me.props.params.id,
					function(data) {
						me.props.parent.setState({video:data.data[0]});
					}
				);
			}
		},
		getVideos:function() {
			var me = this;
			$.ajax({
				url: shusiou_config.api_server + '/api/shusiou_get_videos.js',
				method: "POST",
				data: {uid:1, token:'xxxxx'},
				dataType: "JSON"
			}).done(function( data) {
				me.setState({list:data.data});
				console.log(data);
			}).fail(function( jqXHR, textStatus ) {
				console.log('error');
			});			
		},
		checkVideo:function(id) {
			var me = this;
			if (me.state.vid == id) {
				me.setState({vid:''});
			} else {
				me.setState({vid:id});
			}	
		},		
		render: function() {
			var me = this;
			if ((me.props.params.opt == 'new') && (me.props.parent.state.video)) {
				return (<div>Embed_curriculum_preview
						<div>{me.props.params.opt}
							<h4>{me.props.parent.state.video.title}</h4>	
							<p><b>Video ID</b>:{me.props.parent.state.video.id}</p>  
							<p><b>Video Length</b>:({me.props.parent.state.video.length} Secs)</p>
							<img src={shusiou_config.api_server + 
							'/api/video/play_stream?type:=video&vid='+me.props.parent.state.curriculum.vid+
							'&w=180&s=10'}/>
						</div>	
					
					</div>)
			} else {
				return (<div>Embed_curriculum_preview 2</div>)
			}
		}
	});
	
	
} catch (err) {
	console.log(err.message);
}
