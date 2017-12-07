try {
	var Embed_curriculum_demo =  React.createClass({
		getInitialState: function() {
			var me = this;
			return {};
		},	
		componentDidMount:function() {
			var me = this;
			if (me.props.params.opt == 'new') {
				me.props.parent.getVideoInfo(me.props.params.id,
					function(data) {
						me.props.parent.setState({video:data.data[0]});
					}
				);
			}
		},	
		render: function() {
			var me = this;
			if ((me.props.params.id) && (me.props.parent.state.curriculum)) {
				return (<div>Embed_curriculum_demo 1
						<div>
							<h4>{me.props.parent.state.video.title}</h4>	
							<p><b>Video ID</b>:{me.props.parent.state.curriculum.vid}</p>  
							<p><b>Video Length</b>:({me.props.parent.state.video.length} Secs)</p>
							<img src={shusiou_config.api_server + 
							'/api/video/play_stream.api?type=image&vid='+me.props.parent.state.curriculum.vid+
							'&w=180&s=10'}/></div>	
					
					</div>)
			} else {
				return (<div>Embed_curriculum_preview 2</div>)
			}
		}
	});
	
	
} catch (err) {
	console.log(err.message);
}
