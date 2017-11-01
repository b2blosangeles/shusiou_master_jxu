try {	
	
	var My_video_admin =  React.createClass({
		getInitialState: function() {
			var me = this;
			return {video_url:'', vid:'', error:'', list:[]};
		},
		initState:function() {
			this.setState({video_url:'', vid:'', title:'', length_seconds:0,thumbnail_url:'', error:''});			
		},
		componentDidMount:function() {
			var me = this;	
		},
		componentDidUpdate:function(prePropos, preState) {
			
			var me = this;
			if (prePropos.id != me.props.id) {
			//	console.log(prePropos.id + '=======' + me.props.id);
				me.setState({video_url:'', vid:'', error:'', list:[]});
			}
		},		
		close_admin:function(){
			var me = this;  me.initState(); me.props.parent.closeAdmin();
		},
		handleChange:function(e) {
			var me = this;
			me.setState({video_url:e.target.value});
		},
		videoUrlValidation:function(){
			var p = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
			return (this.state.video_url.match(p))?true:false;
		},		
		videoUrlSubmitable:function(){
			return (this.videoUrlValidation())?'input-group-addon btn btn-warning':'input-group-addon btn btn-warning disabled';
		},
		videoUrlSubmit:function(){
			var me = this;
			$.ajax({
				url: shusiou_config.api_server + '/api/video/myVideo.api?opt=add',
				method: "POST",
				data: {code: me.state.video_url, uid:'1', token:'xxxxx'},
				dataType: "JSON"
			}).done(function( data) {
				// me.videoDownload();
				console.log(data);
				me.props.parent.pullList();
				me.close_admin();
				me.initState();	
			}).fail(function( jqXHR, textStatus ) {
				me.close_admin();
				me.initState();	
			//	me.setState({error:'Request failed: ' + textStatus});
			});
		},		
		videoUrlDecode:function(){
			var me = this;
			console.log('----me.props.parent.route.env.state.auth---->');
			console.log(me.props.parent.props.route.env.state.auth);
			$.ajax({
				url: shusiou_config.api_server + '/api/video/myVideo.api?opt=getYouTubeInfo',
				method: "POST",
				data: {video_url: me.state.video_url},
				dataType: "JSON"
			}).done(function( data) {
				me.setState({vid:data.vid, title:data.title, length_seconds:data.length_seconds, thumbnail_url:data.thumbnail_url});
			}).fail(function( jqXHR, textStatus ) {
				me.initState();				
				me.setState({error:'Request failed: ' + textStatus});
			});
		},	
		render:function() {
			var me = this;
			if (!me.state.vid) return (
			<p>				
				<h5>Pulling YouTube Video</h5>	
				<div className="input-group">
				  <input type="text" className="form-control" placeholder="Input YouTube link" 
					  value={me.state.video_url}
					  onChange={this.handleChange.bind(this)}
					  aria-describedby="basic-addon2"/>
				  <div className={me.videoUrlSubmitable()} onClick={me.videoUrlDecode.bind(me)}>Submit</div>
				</div>
				<hr/>
				<p>
					<h5>Or pulling a shared videos</h5>
				</p>					
			</p>);	
			else return (
			<span>						
				<div>	
					<div style={{float:'left', padding:'1em'}}> 
						<img src={me.state.thumbnail_url}/>
					</div>					
					<div> 
						<div>
							<h4>{me.state.title}</h4>	
							<p><b>Video ID</b>:{me.state.vid}</p>  
							<p><b>Video Length</b>:({me.state.length_seconds} Secs)</p>
							<p>
								<button type="button" 
									className="btn btn-warning" 
									onClick={me.videoUrlSubmit.bind(me)}>
								Pulling this video</button>
								&nbsp;
								<button type="button" 
									className="btn btn-default" 
									onClick={me.close_admin.bind(me)}>
								Cancel</button>
							</p>
						</div>	
					</div>
				</div>
				<div className="download_matrix">
				{(function() {
					if (me.state.list) {	
						return me.state.list.map(function (item) { 
							if (item == 1) {
								return  (<i className="fa fa-square text-success" aria-hidden="true"></i>)
							} else if (item == 9)  {
								return  (<i className="fa fa-square text-warning" aria-hidden="true"></i>)
							} else {
								return  (<i className="fa fa-square-o" aria-hidden="true"></i>)
							} 
						})
					} else {
						return  (<span>connection ...</span>)
					}
				})()}
				</div>	
			</span>);
		}
	});
	var My_video_admin_footer =  React.createClass({
		close_admin:function(){
			var me = this;
			
			me.props.parent.closeAdmin();
		},
		render:function() {
			var me = this;
			return (<span/>);
			return (
				<div className="modal-footer">
					<button type="button" className="btn btn-warning" data-dismiss="modal">Close</button>
				</div>	
			);
		}
	});
	var My_video_admin_header =  React.createClass({
		close_admin:function(){
			var me = this;
			me.props.parent.setState({popup_id:new Date().getTime()});
		//	me.props.parent.closeAdmin();
		},		
		render:function() {
			var me = this;
			return (
				<div className="modal-header">
					{/*<button type="button" className="close" data-dismiss="modal">
						&times;
					</button>*/}
					<button type="button" className="close"  data-dismiss="modal" onClick={me.close_admin.bind(me)}>&times;</button>
					<h5 className="modal-title">Video Admin</h5>
				</div>	
			);
		}
	});	
} catch (err) {
	console.log(err.message);
}
