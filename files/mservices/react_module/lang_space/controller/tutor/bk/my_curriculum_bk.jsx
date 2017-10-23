try {
	var MyCurriculumById =  React.createClass({
		getInitialState: function() {
			var me = this;
			return {text:_DATA_["/data/home_page.json"],
				preview_time:0,
				section:null,
				video:{},
				curriculum:{id:''},
				setion:null,
				sections:[
					// {s:23, t:42, text:'title 2'}
				]	
			};
		},
		editVideo:function(params) {
			var me = this;
			ReactDOM.render(
			    (<Embed_video_editor parent={me} params={params} video={me.state.video} />),
			    $('.my_curriculum_session_video')[0]
			  );		
		},
		editCurriculum:function(params) {
			var me = this;
			ReactDOM.render(
			    (<Embed_curriculum_editor parent={me} params={params} video={me.state.video} />),
			    $('.my_curriculum_info')[0]
			  );	
		},
		templateSection:function(params, section) {
			var me = this;
			ReactDOM.render(
			    (<TemplateSectionForm parent={me} params={params} section={section}/>),
			    $('.my_curriculum_info')[0]
			  );		       
		},		
		toHHMMSS:function(v, noms) {
		  var h = Math.floor(v / 3600),m = ("00" + Math.floor((v % 3600) / 60)).slice(-2), 
		      s = ("00" + (Math.floor(v) % 3600) % 60).slice(-2), ms = 1000 * (v - Math.floor(v));
		     if (!noms) { ms = (ms)?'&#189;':''; }
		     else ms = '';			
		  return h + ':' + m + ':' + s + ' ' + ms;
		},		
		componentDidMount:function() {
			var me = this;
			var vid = '';
			if (me.props.params['opt'] == 'new') {
				vid = me.props.params['id'];
				me.getVideoInfo(vid,
					function(data) {
						me.setState({vid:vid, video:data.data[0]});
						me.editVideo(me.props.params);
						me.editCurriculum(me.props.params);				
					}
				);
			} else if (me.props.params['opt'] == 'edit') {
				var cid = me.props.params['id'];
				me.getCurriculumById(cid, function(data) {
					me.setState({vid:data.video.id, video:data.video, curriculum:data.curriculum});
					me.editVideo(me.props.params);
					me.editCurriculum(me.props.params);
				});
			//	me.setState({curriculum:{id:cid}});
			}
		//	$('.video_ad').attr('autoplay', true).attr('loop', true);
		//	$(".video_ad").attr('src', shusiou_config.api_server + '/api/shusiou_video_tmp_section.js?video='+vid+'|10|30');				
		},
		componentDidUpdate:function() {
			var me = this;
		},
		submitCurriculum:function(v, jump){
			var me = this;
			var data = {};
			if (me.state.curriculum.id) {
				data = {cmd:'update', id:me.state.curriculum.id, vid: me.state.curriculum.vid, name:me.state.curriculum.name, uid:'1', token:'xxxxx'};
			} else {
				data = {cmd:'add', vid: me.state.video.id, name:me.state.curriculum.name, uid:'1', token:'xxxxx'};
			}
			$.ajax({
				url: shusiou_config.api_server + '/api/shusiou_curriculum.js',
				method: "POST",
				data: data,
				dataType: "JSON"
			}).done(function( data) {
				if ((data.data) && v === '') {
					me.props.router.push('/tutor/my_curriculum/edit/'+data.data);
					me.componentDidMount();
					//window.location.reload();
				} else if (jump) {
					me.props.router.push('/tutor/my_curriculums');
				}
			}).fail(function( jqXHR, textStatus ) {
				alert(2);
			});			
		},
		dictionary:function(v) {
			if (!this.props.route || !this.props.route.env ||!this.props.route.env.dictionary) return v;
			return this.props.route.env.dictionary(v);
		},
		getVideoInfo: function(vid, cbk) {
			var me = this;
			$.ajax({
				url: shusiou_config.api_server + '/api/shusiou_get_videoinfo_byid.js',
				method: "POST",
				data: { vid:vid},
				dataType: "JSON"
			}).done(function( data) {
				if (typeof cbk == 'function') {
					cbk(data);
				}
			}).fail(function( jqXHR, textStatus ) {
				console.log( "Request failed: " + textStatus );
			});
		},		
		getCurriculumById: function(cid, cbk) {
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
		},	
		handleTextChange:function(event){
			this.setState({c_text: event.target.value});
		},
		saveAble: function() {
			var me = this, A = me.state.list;
			if (!me.state.c_text) return {display:'none'};
			else return {display:''};
		},
		editSection:function(section) {
			var me = this;
			me.setState({ModalPlus:{type:'popup',  hold:0,
				box_style:{top:'28px'},
				header:(<span/>),
				message: (<TemplateFollowMe_body parent={me} section={section}/>),
				footer:(<span/>)		
			}});
					       
		},
		deleteSection:function(section) {
			var me = this;
			var o = me.state.sections, v = [];	
			for (var i = 0; i < o.length; i++) {
				if (o[i].s == section.s && o[i].t == section.t) continue;
				else v[v.length] = o[i]; 
			}
			me.setState({sections:v});
			me.editCurriculum(me.props.params);
			return true;       
		},		
		closePopup:function() {
			var me = this;
			me.setState({ModalPlus:'cancel'});			
			return true;
		},
		abortSection: function() {
			var me = this;
			me.editCurriculum(me.props.params);
		},		
		acceptSection: function(v) {
			var me = this;
			var o = me.state.sections;
			o[o.length] = JSON.parse(JSON.stringify(v));
			me.setState({sections:o});
			me.editCurriculum(me.props.params);
		},		
		render: function() {
			var me = this;
			return (
				<div className="content_section">
					<br/>
					<div className="container">
						<div className="col-sm-6 col-lg-5 col-md-6"> 
							<div className="overlayer_box editor_box">
								<span className="my_curriculum_session_video"></span>
							</div>	
						</div>
						
						<div className="col-sm-6 col-lg-7 col-md-6"> 
							<div className="overlayer_box editor_box">							
								<span className="my_curriculum_info"></span>
								{/*<span className="my_curriculum_sections"></span>*/}			
							</div>	
						</div>						
					</div>	

					<div className="content_bg opacity_bg">
						<video id="video_ad" className="video_ad"  src="" muted></video>
					</div>
					<ModalPlus parent={me} />
				</div>
			)
		}
	});	
	
} catch (err) {
	console.log(err.message);
}
