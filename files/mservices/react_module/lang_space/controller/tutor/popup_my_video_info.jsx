try {

	var Popup_my_video_info =  React.createClass({
		getInitialState: function() {
			var me = this;
			return {};
		},
		componentDidMount:function() {
			var me = this;

			$('.pop_preview')[0].src = me.videoLink();
			$('.pop_preview')[0].play();
		},
		componentDidUpdate:function(prePropos, preState) {
			var me = this;
			$('.pop_preview')[0].src = me.videoLink();
			$('.pop_preview')[0].play();			
		},		
		close_admin:function(){
			var me = this;  $('.pop_preview')[0].src = ''; me.props.parent.closeAdmin();
		},
		delete_video:function(){
			var me = this;  
			me.props.parent.videoDelete(me.props.rec.vid);
			me.close_admin();
			
		},		
		videoLink:function(){
			var me = this; 
			alert(JSON.stringify(me.props.rec));
			return true;
			var IP = me.props.rec.node_ip[Math.floor(Math.random() * me.props.rec.node_ip.length)];
			if (me.props.rec.node_ip.length) {
				var url =  '//' + IP + '/api/video/play_stream.api?type=video&vid=' + me.props.rec.vid +
				    '&server=' + me.props.rec.server_ip ;
			} else { 
				var url = 'http://' + me.props.rec.server_ip + 
				    '/api/video/play_stream.api?type=video&vid=' + me.props.rec.vid;
			}
			return url;
		},			
		render:function() {
			var me = this;
			return (
				<p>
					{/*
					<button type="button" className="close pull-right"  
						onClick={me.close_admin.bind(me)}
						>&times;</button>
					*/}	
					<div className="container">
						<div className="row">
							<h4>{me.props.rec.title}</h4>
						</div>
						<div className="row">
							<div style={{'padding-bottom':'0.5em'}}>
								<button type="button" className="btn btn-danger"
									onClick={me.delete_video.bind(me)}>
								<i className="fa fa-trash-o" aria-hidden="true"></i> Delete the video
								</button>
								&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
								<button type="button" className="btn btn-info"
									onClick={me.close_admin.bind(me)}>
								<i className="fa fa-close" aria-hidden="true"></i> Close
								</button>
							</div>	
						</div>	
						<div className="row">			
							<video className="pop_preview" width="800" height="450" controls autoplay>
							  <source src="" type="video/mp4"/>
							</video>
						</div>							
					</div>	
				</p>
			)	
		}
	});	
	
} catch (err) {
	console.log(err.message);
}
