try {
	var Embed_video_editor =  React.createClass({
		getInitialState: function() {
			var me = this;
			alert(10);
			me.video = me.props.video;
			me.sections = me.props.sections;
			// me.curriculum = me.props.curriculum;
			me.section = me.props.section; 
			return {
				preview_time:0,
				section:{},
				video:{},
				video_bar_width:0
			};
		},	
		componentDidMount:function() {
			var me = this, code = '';
			alert(11);
			me.setState({section:me.section});
			var p_video = $('#preview_video')[0];
			if (p_video) {
				p_video.ontimeupdate = function() {
					var v = Math.floor(p_video.currentTime);
					me.setState({preview_time:v})
				};
			}
			var ips = me.video.node_ip;
			var IP = ips[Math.floor(Math.random() * ips.length)];
		//	var vurl =  shusiou_config.api_server + '/api/video/play_stream.api?type=video&vid='+me.props.parent.state.curriculum.vid;
			var vurl = 'http://' + IP + '/api/video/play_stream.api?type=video&vid=' +
			    me.video.vid + '&server=' +  me.video.server_ip;
			var _itv = setInterval(
				function() {
					if (me.video.vid) {
						clearInterval(_itv);
						me.setState({vid:me.video.vid});
						p_video.src =  vurl;
						setTimeout(
							function() {

								me.setState({video_bar_width:Math.round($('#video_bar').width())},
									function() {

									}	    
								);
							}, 1000	
						);		
					}
				}
			,100);
		},
		clickTime:function(v) {
			var me = this;
			
			var n = me.state.video_bar_width, X = [];
			var MAX = 1000;
			n = (n > MAX)?MAX:n;	
			
			var p_video = $('#preview_video')[0];
			var c_video = $('#preview_clip_video')[0];
			var ips = me.video.node_ip;
			var IP = ips[Math.floor(Math.random() * ips.length)];
			p_video.currentTime = Math.round(me.video.video_length * v / n);
			me.setState({section:{s:p_video.currentTime, t:10}}, function() {
				p_video.pause();
				c_video.pause();
				me.playSection();			
			});

		},
		toHHMMSS:function(v, noms) {
			if (isNaN(v)) return v;
		  	var h = Math.floor(v / 3600),m = ("00" + Math.floor((v % 3600) / 60)).slice(-2), 
		     		s = ("00" + (Math.floor(v) % 3600) % 60).slice(-2), ms = 1000 * (v - Math.floor(v));
		     	if (!noms) { ms = (ms)?'&#189;':''; }
		     	else ms = '';			
		  	return h + ':' + m + ':' + s + ' ' + ms;
		},		
		videoBar:function() {
			var me = this;
			var n = me.state.video_bar_width, X = [];
			var MAX = 1000;
			n = (n > MAX)?MAX:n;
			
			for (var i=0; i < n; i++) X[X.length] = '';
			let video_length = me.video.video_length;

			return (
				<table id="video_bar" width="100%" height="16" style={{'border':'1px solid #ddd'}}><tr>
				{
					X.map(function(x, idx) {
						if (idx >= Math.round(n * me.state.section.s / video_length ) && 
						    	idx < Math.round(n * (me.state.section.s +me.state.section.t) / video_length)) {
							return (<td width="1" style={{'background-color':'red'}}></td>)
						}	
						for (var j = 0; j < me.sections.length; j++) {
							if (me.sections[j].id == me.section.id) continue;
							if (idx >= Math.round(n * me.sections[j].track.s / video_length ) && 
							    idx < Math.round((n * me.sections[j].track.s + n * me.sections[j].track.t) / video_length)) {
								return (<td width="1" style={{'background-color':'lightgreen'}}></td>)
							}
						}
						return (<td width="1" style={{'background-color':'lightyellow'}}
							onClick={me.clickTime.bind(me,idx)} className="videoBar"
							></td>)
					})
				}
				<td width="*" style={{'background-color':'#ddd'}}></td>	
				</tr></table>
			);	
		},
		
		
		componentDidUpdate:function(prePropos, preState) {
			var me = this;
			if (prePropos.popid != me.props.popid) {
				// alert(18);
				me.sections = me.props.sections;
				me.setState({section:me.section});
				// me.setState({section:me.section.track});
			}
		},
		sendTrack: function() {
			var me = this;
			var v = me.section;
			var c_video = $('#preview_clip_video')[0];
			var p_video = $('#preview_video')[0];
			if (c_video) c_video.pause();
			if (p_video) p_video.pause();
			v.s = me.state.section.s;
			v.t = me.state.section.t;
			// v = {s:me.state.section.s, t:me.state.section.t};
			me.props.parent.closePopup();	
			return true;
			me.props.parent.setState({section:v}, 
				function() {
					me.props.parent.closePopup();	
				});
		},
		showSectionImages: function() {
			var me = this, A = [];
			if (!me.state.section) return false;
			for (var i = 0; i < 2 * me.state.section.t; i++) {
				A[A.length] = me.state.section.s + i * 0.5;
			}
			var ips = me.video.node_ip;
			
			return A.map(function(a,idx){
				//var v = shusiou_config.api_server + '/api/video/play_stream.api?type=image&vid=' + 
				//    me.props.parent.state.curriculum.vid +'&w=90&s=' + a;
				var IP = ips[Math.floor(Math.random() * ips.length)];
				var v = 'http://' + IP + '/api/video/play_stream.api?type=image&vid=' + 
				    me.video.vid +'&w=90&s=' + a + '&server=' + 
				    me.video.server_ip;
				
				if (idx < 8 || idx > A.length - 8) return (<img src={v} width="90" style={{border:'1px solid red'}} />)
				else return (<span></span>)
			});
		},
		
		
		playSection:function() {
			var me = this, v =  shusiou_config.api_server + '/api/video/play_stream.api?type=section&vid='+
			    me.video.vid + '&s=' + me.state.section.s + '&l=' + me.state.section.t;
			$('#preview_clip_video')[0].src = v;
			$('#preview_clip_video')[0].play();		
		},
		
		disbleAdjustSection:function(ds, dt) {
			var me = this;
			return (!me.changeAble(ds, dt))?{display:'none'}:{display:''};
		},		
		
		changeAble:function(ds, dt) {
			return true;
			var me = this;
			var n = me.state.video_bar_width, X = [];
			var MAX = 1000;
			n = (n > MAX)?MAX:n;	
			var s =  parseFloat(me.state.section.s) + parseFloat(ds); t = s + parseFloat(me.state.section.t) + parseFloat(dt);
			for (var j = 0; j < me.sections.length; j++) {
				if (me.sections[j].id == me.section.id) continue;
				for (var d = s; d < t; d+=0.5) {
					if (d >= me.sections[j].track.s &&  d < (me.sections[j].track.s + me.sections[j].track.t)) {
						return false;
					}
				}
			}
			return true;
		},		
		
		adjustSection:function(ds, dt) {
			var me = this;
			if (!me.changeAble(ds, dt)) return true;
			var s = parseFloat(me.state.section.s) + parseFloat(ds); if (s<0) s=0;
			var t = parseFloat(me.state.section.t) + parseFloat(dt); if (t>20) t=20; if (t<2) t=2;
			me.setState({section:{s:s, t:t}}, function(){
				me.playSection();	
			});
			
		},
		bytesToSize:function (bytes) {
		   var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
		   if (bytes == 0) return '0 Byte';
		   var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
		   return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
		},		
		hideNullSection: function() {
			return (this.state.section.t == null)?{display:'none'}:{diaplay:''};
		},
		hideValueSection: function() {
			return (this.state.section.t != null)?{display:'none'}:{diaplay:''};
		},		
		preCacheImage:function() {
			var me = this;
		},	
		render: function() {
			var me = this;
			return (
				<div className="container-fluid">
					<table width="100%" className="section_template_frame">	
					<tr>
							<td width="48%">
								Original Movie:

							</td>
							<td width="1%" style={{'border-right':'2px solid #ccc'}}></td>
							<td width="1%" style={{'border-left':'2px solid #ccc'}}></td>
							<td width="50%">
								<video id="preview_clip_video" style={{display:'none'}}>
									<source src="" autoplay
									type="video/mp4"/>
								</video>
								Movie clip :<span 
								style={(me.state.section.s !== null)?{display:''}:{display:'none'}}		     
								dangerouslySetInnerHTML={{__html: (me.state.section.t)?(me.toHHMMSS(me.state.section.s) + 
								' - ' + me.toHHMMSS(me.state.section.s + me.state.section.t)):''}} />

								<button type="button" className="btn btn-default btn-xs video_editor_button" 
									style={(me.state.section.t)?{display:''}:{display:'none'}}
									onClick={me.playSection.bind(this)}>
									<i className="fa fa-play" aria-hidden="true"></i>&nbsp;Listen 
								</button>

								<button type="button" className="btn btn-warning video_editor_button" 
									style={(me.state.section.t)?{display:''}:{display:'none'}}
									onClick={me.sendTrack.bind(me)}>
									Accept clip
								</button>								
							</td>
						</tr>						
						<tr>
							<td width="48%">
								<video id="preview_video" width="100%" controls>
									<source src="" 
									type="video/mp4"/>
								</video>							
							</td>
							<td width="1%" style={{'border-right':'2px solid #ccc'}}></td>
							<td width="1%" style={{'border-left':'2px solid #ccc'}}></td>						
							<td width="50%">
							{me.showSectionImages()}

							</td>
						</tr>
					</table>	
					<div id="niu1"></div>
					<br/>	
					{me.videoBar()}	
					<table width="100%" className="section_template_frame">		
						<tr>
							<td width="48%">
								{/*
								<button type="button" className="btn btn-sm btn-success btn_margin3 pull-left" 
									onClick={me.pickVideo.bind(this, true)}>
									<i className="fa fa-scissors" aria-hidden="true"></i>
								</button>							
								<button type="button" className="btn btn-sm btn-info btn_margin3"
									onClick={me.setHelp.bind(me, 'Help with Curriculum','/help/curriculum.html')}>
									<i className="fa fa-question" aria-hidden="true"></i> Help
								</button>*/}						
							</td>
							<td width="1%" style={{'border-right':'2px solid transparent'}}></td>
							<td width="1%" style={{'border-left':'2px solid transparent'}}></td>						
							<td width="50%">
								<span style={me.hideNullSection()}>
									 <button type="button" className="btn btn-sm btn-success btn_margin3"
										  style={me.disbleAdjustSection(-0.5, 0)}
										 onClick={me.adjustSection.bind(this, -0.5, 0)}> 									
										 <i className="fa fa-step-backward" aria-hidden="true"></i> -&#189;</button>							

									<button type="button" className="btn btn-sm btn-success btn_margin3"
										style={me.disbleAdjustSection(0.5, 0)}
										 onClick={me.adjustSection.bind(this, 0.5, 0)}> 
										<i className="fa fa-step-backward" aria-hidden="true"></i> +&#189;</button>

									<button type="button" className="btn btn-sm btn-success btn_margin3"
										style={me.disbleAdjustSection(0,0.5)}
										 onClick={me.adjustSection.bind(this, 0, 0.5)}> 
										<i className="fa fa-plus-square-o" aria-hidden="true"></i>
									</button>	

									<button type="button" className="btn btn-sm btn-success btn_margin3"
										style={me.disbleAdjustSection(0,-0.5)}
										 onClick={me.adjustSection.bind(this, 0, -0.5)}> 
										<i className="fa fa-minus-square-o" aria-hidden="true"></i>
									</button>
								</span>							

							</td>
						</tr>						
					</table>	

					<span className="pull-right text-warning" style={{'padding-top':'0.5em'}}>
						{(function() {
							if ((me.state.video.length) && (me.state.video.q)) {
								return 'Lazy caching ...';
							} else {
								return '';
							}
						})()}									

					</span>	
					<p className="video_editor" style={me.hideNullSection()}>
						{/*me.showSectionImages()*/}
					</p>
				</div>	

				)
		}
	});	
	
} catch (err) {
	console.log(err.message);
}
