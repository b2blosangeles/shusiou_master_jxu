try {
	var Compsection =  React.createClass({
		getInitialState: function() {
			var me = this;
			return {buffer:[]};
		},
		shusiouComm:function(q, view_id, callback) {		
			var me = this;
			me.props.parent.setState({message:{text:''}});
			if (!callback && typeof view_id === 'function') var callback = view_id, view_id = false;
			var view_id = (!view_id)?'shusiou_video':view_id; 
			
			if (!$('#'+view_id)[0]) {
				$("body").append('<video id="' + view_id + '"/>'+view_id); 
				$('#'+view_id).hide();
			}
			if (!$('#shusiou_audio')[0]) {
				$("body").append('<video id="shusiou_audio"/>'); 
				$('#shusiou_audio').hide();
			}			
			if (!q.length) {
				if (typeof callback == 'function') callback();
				return true;
			}
			var o = q.shift();
			var v = me.state.buffer; v[v.length] = o;
			me.setState({buffer: v});
			
			$('#shusiou_audio').unbind('ended').unbind('error')
				.on("ended", function() { me.shusiouComm(q, view_id, callback); })
				.on("error", function() { me.shusiouComm(q, view_id, callback); });
			$('#' + view_id).unbind('ended').unbind('error')
				.on("ended", function() { me.shusiouComm(q, view_id, callback); })
				.on("error", function() { me.shusiouComm(q, view_id, callback); });
			
			
			if (o.action) {
				console.log('----q---->');
				console.log(me.props.q.curriculum);
				var rec = me.props.q.curriculum
				var ips =rec.node_ip;
				var IP = ips[Math.floor(Math.random() * ips.length)];
				var vurl = 'http://' + IP + '/api/video/play_stream.api?type=section' +
				    '&s=' +  me.props.q.s + '&l=' +  me.props.q.t +
				    '&vid=' + rec.vid + '&server=' +  rec.server_ip;
				console.log(vurl);
				
				var url = shusiou_config.api_server + '/api/shusiou_video_tmp_section.js?video=' + me.props.q.vid +'|' + 
			    		me.props.q.s  + '|' + me.props.q.t;
				$('#'+view_id).attr('src', vurl).attr('autoplay', true);
				me.props.parent.setState({message:{text:o.text}});
				return true;			
				
			}	
			if (o.video) {
				
				$('#'+view_id).attr('src', o.video).attr('autoplay', true);
				me.props.parent.setState({message:{text:o.text}});
				return true;
			} 
			if (o.audio) {
				$('#shusiou_audio').attr('src', o.audio).attr('autoplay', true);
				me.props.parent.setState({message:{text:o.text}});
				return true;
			}	
			if (o.text) {
				me.props.parent.setState({message:{text:o.text}});
				
				$('#shusiou_audio').attr('src', '/api/lang_space/test_google_tts.js?str='+o.text + '&lang=' + o.lang).attr('autoplay', true);
				return true;
			}
			if (o.answer) {
				// annyang.setLanguage(o.lang);
				// annyang.start({continuous:true});
				me.answer(o, q, callback);
				return true;
			}
			me.shusiouComm(q, view_id, callback);
		},
		componentDidMount:function() {
			var me = this;	
			
		},
		componentDidUpdate:function(prevProps, prevState) {
			var me = this;	
			if (prevProps.q.id != me.props.q.id) {
				me.callQNA(me.props.q);
			}			
		},		
		
		componentWillUnmount:function() {
			var me = this;	
		},		
		callQNA: function(v) {
			var me = this;
			me.setState({buffer:[]});
			var q = me.cloneArray(v.q);
			me.shusiouComm(q, 'rep_video', v.callback);			
		},		
		cloneArray:function(o) {
			var r = [];
			for (var i=0; i < o.length; i++) r[r.length] = o[i];
			return r;
		},
		answer:function(o, list, callback) {
			var me = this;
			if (annyang) {
				annyang.removeCallback('resultNoMatch');
				annyang.removeCommands(); // remove all commands
				annyang.setLanguage(o.lang);
			//	annyang.resume();
				annyang.start({continuous:true});
				var commands = {};
				commands[o.answer] = function() {
					var match = me.cloneArray(o.match);
					annyang.abort();
					me.shusiouComm(match, 'rep_video', function() {
						annyang.removeCommands([o.answer]);
					//	annyang.removeCommands([o.answer]); remove all
						//annyang.pause();
						me.shusiouComm(list, 'rep_video', callback );
					});					
					// annyang.abort();
				};
			
				commands['退出'] = function() {
					annyang.abort();
					me.shusiouComm([{text:'OK. lets stop talking', lang:'en-US'}], 'rep_video');
				};				
				
				// zh-CN -- 			
				
				annyang.addCommands(commands);
				me.props.parent.setState({message:{text:o.message}});
				annyang.addCallback('resultNoMatch', function() {
					annyang.abort();
					
					var nomatch = me.cloneArray(o.nomatch);
					
					me.shusiouComm(nomatch, 'rep_video', function() {
					//	console.log(o.nomatch);
						annyang.resume();
						me.answer(o, list, callback);
					});					
				});
				
			}
		},		
		render: function() {
			var me = this;
			return (
				<div className="content_section">
					<video id="rep_video"  controls width="400">
					  <source src="horse.ogg" type="audio/ogg"/>
					Your browser does not support the audio element.
					</video>
				</div>
			)
		}
	});	
	
} catch (err) {
	console.log(err.message);
}
