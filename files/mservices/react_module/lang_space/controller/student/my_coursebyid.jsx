try {
	var Mycoursebyid =  React.createClass({
		getInitialState: function() {
			var me = this;
			return {
				current_q:[],
				buffer:{},
				message:{},
				list:[], 
				video:{}
			};
		},
		
		getCurriculumById: function(curriculum_id, cbk) {
			var me = this;
			me.props.route.env.engine({
				url: shusiou_config.api_server + '/api/curriculum/myCurriculum.api',
				method: "POST",
				data: { cmd:'getCurriculumById',
				       curriculum_id:curriculum_id,
				      auth:me.props.route.env.state.auth},
				dataType: "JSON"
			}, function( data) {
				console.log('---data A-->');
				console.log(data.data);
				if (typeof cbk == 'function') {
					cbk(data.data);
				}
			},function( jqXHR, textStatus ) {
				console.log( "Request failed: " + textStatus );
			});
			/*
			$.ajax({
				url: shusiou_config.api_server + '/api/shusiou_curriculum.js',
				method: "POST",
				data: { cmd:'getCurriculumById', cid:cid},
				dataType: "JSON"
			}).done(function( data) {
				if (typeof cbk == 'function') {
					cbk(data);
				}
			}).fail(function( jqXHR, textStatus ) {
				console.log( "Request failed: " + textStatus );
			});
			*/
		},
		runCurriculum:function(code) {
			var me = this;
			$('#video_ad').attr('src', shusiou_config.api_server + '/api/shusiou_play_video.js?vid='+code).attr('autoplay', true);
			var vid = $('#video_ad')[0];	
			vid.ontimeupdate = function() {
				var inframe = false;
				for (var i = 0; i< me.state.list.length; i++) {
					if (vid.currentTime >  me.state.list[i].s && 
					    vid.currentTime < ( me.state.list[i].s +  me.state.list[i].t)) {
						inframe = true;
						me.callQNA(i, 
							(function(i) {
								return function() {
									vid.currentTime = me.state.list[i].s +  me.state.list[i].t;
									vid.play();
									// me.answer(vid, me.state.list[i].s +  me.state.list[i].t);
								}	
							})(i)						
						);
						vid.pause();
					}
				}
				if (!inframe) me.setState({current_q:{q:[]}});
			};			
		},
		multiSectense: function(q, rec) {
			if (rec.text) {
				var a = rec.text.split(/\[s\]/i);
				
				for (var i=0; i<a.length; i++) {
					rec.text = a[i];
					q[q.length] = JSON.parse(JSON.stringify(rec));
				}
			} else {
				q[q.length] = rec;
			}
		},
		componentDidMount:function() {
			var me = this;
			me.getCurriculumById(me.props.params.id,
				function(data) {
					var v = [], script = data.script;
					for (var j=0; j <script.length; j++) {
						
						var q = [];
						for (var i=0; i < script[j].o.pro.length; i++) {
							var q_item = script[j].o.pro[i];
							me.multiSectense(q, q_item);
						//	q[q.length] = q_item;
							if (q_item.action) {
							//	q[q.length] = {text:"Saying",
							//      	lang:'en-US'};
								
							//	q[q.length] = {text:data.curriculum.script[j].o.ans.text,
							//      	lang:'zh-CN'};								
							}
						}
						var ansidx = q.length;
						q[ansidx]= {};
						q[ansidx].answer = script[j].o.ans.text;
						q[ansidx].lang = 'zh-CN';
						q[ansidx].match = script[j].o.match;
						var nomatch = [];
						for (var i=0; i < script[j].o.non_match.length; i++) {
							var nomatch_o = data.curriculum.script[j].o.non_match[i];
							
							
							if (nomatch_o.action) {
						//		nomatch[nomatch.length] = {text:"Saying",
						//	      	lang:'en-US'};
								nomatch[nomatch.length] =  {text:script[j].o.ans.text,
							      	lang:'zh-CN'};
							} else {
								nomatch[nomatch.length] = nomatch_o;
							}
								
						}
						q[ansidx].nomatch = nomatch;
						
						q[q.length] = script[j].o.done;
						
						v[v.length] = {s:script[j].track.s, 
							       t:script[j].track.t, q:q}
						
					}
					me.setState({list:v, video:data.video});
					me.runCurriculum(data.video.code);
				}
			);			
		},		
		callQNA: function(idx, callback) {
			var me = this, v =  me.state.list[idx];
			var q = {id:idx, vid:me.state.video.code, s:v.s, t:v.t, q:v.q, callback:callback};
			me.setState({current_q:q});
			return true;
		},
		dataApi: function(opt) {
			var me = this, A = me.state.list;
			$.ajax({
				url: '/api/lang_space/data_api.js',
				method: "POST",
				data: { opt:opt, lesson_code:'sample.mp4', list:me.state.list},
				dataType: "JSON"
			}).done(function( data) {
				me.setState({list:data.list});
				console.log(data);
			}).fail(function( jqXHR, textStatus ) {
				console.log( "Request failed: " + textStatus );
			});
		},		
		cloneArray:function(o) {
			var r = [];
			for (var i=0; i < o.length; i++) r[r.length] = o[i];
			return r;
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
		showCut: function() {
			var me = this, A = [];
			for (var i = 0; i < me.state.c_t; i++) A[A.length] = me.state.c_s + i;
			return A.map(function(a){
				var v = '/api/lang_space/vr_img.js?video=sample.mp4|'+a;		
				return (<img src={v} width="90"/>)	       
			});
		},
		showSection: function() {
			var me = this;
			return me.state.list.map(function(a, idx){	
				var v = '';
				for (var i=0; i < a.q.length; i++) {
					if (a.q[i].answer)  v = a.q[i].answer;	
				}
				return (
				<span>		
					<p>
						{idx + 1}: <a href="JavaScript:void(0)" onClick={me.callQNA.bind(me, idx)}>{v}</a><br/>
					</p>	
				</span>			
				)	       
			});
		},
		overlayerShow:function() {
			var me = this;
			if ((me.state.current_q) && (me.state.current_q.q) && (me.state.current_q.q.length)) {
				return {display:''};
			} else {
				return {display:'none'};
			}
		},

		render: function() {
			var me = this;
			return (
				<div className="content_section">
					<br/>
					<div className="container">
						<div className="row">
							<div className="col-sm-8 col-lg-8 col-md-8"> 
								
								<div className="overlayer_box public_box"  style={me.overlayerShow()}>
									<Compsection q={me.state.current_q} parent={me}/>
									{/*me.showBufferImg()*/}
									<div>{/*me.showBufferSingleText()*/}
										{me.state.message.text}
									</div>
								</div>
								
							</div>
							<div className="col-sm-4 col-lg-4 col-md-4"> 
								
								<div className="overlayer_box public_box">
									{me.showSection()}
								</div>	
							</div>
						</div>	
					</div>	
					<div className="content_bg">
						<video id="video_ad" className="video_ad"  src=""></video>
					</div>					
				</div>
			)
		}
	});
	
} catch (err) {
	console.log(err.message);
}
