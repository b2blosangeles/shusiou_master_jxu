try {
	var MyCurriculumById =  React.createClass({
		getInitialState: function() {
			var me = this;
			return {
				preview_time:0,
				section:{},
				video:{},
				curriculum:{id:''},
				sections:[],
				langs:[
					{code:'en-US', desc:'English'},
					{code:'cn-ZH', desc:'Chinese'}
				],
				levels:[
					{code:'1', desc:'Entrant level'},
					{code:'2', desc:'Advanced level'}
				],				
				req:0
			};
		},
		mainBox:function() {
			var me = this;
			return (
				<div className="container">
					<div className="col-sm-6 col-lg-5 col-md-6"> 
						<div className="overlayer_box editor_box">
							{me.leftBox(me.props.params)}
						</div>	
					</div>

					<div className="col-sm-6 col-lg-7 col-md-6"> 
						<div className="overlayer_box editor_box">
							{me.rightBox(me.props.params)}			
						</div>	
					</div>						
			</div>);
		},
		leftBox:function(params) {
			var me = this;
			if (params.opt == 'new') {
				return (<Embed_new_curriculum parent={me} params={params} video={me.state.video}/>);
				
			} else return(<Embed_curriculum_profile parent={me} params={params} video={me.state.video} />);
		},
		rightBox:function(params) {
			var me = this;	
			if (params.opt == 'new') return (<Embed_curriculum_preview parent={me} params={params} video={me.state.video}/>);
			else if (!me.state.section.id) {
				return (<Embed_curriculum_demo parent={me} params={params} video={me.state.video}/>);
			} else return (<TemplateSectionForm parent={me} params={params} section={me.state.section} />);		
		},
		toHHMMSS:function(v, noms) {
			if (isNaN(v)) return v;
		  	var h = Math.floor(v / 3600),m = ("00" + Math.floor((v % 3600) / 60)).slice(-2), 
		     		s = ("00" + (Math.floor(v) % 3600) % 60).slice(-2), ms = 1000 * (v - Math.floor(v));
		     	if (!noms) { ms = (ms)?'&#189;':''; }
		     	else ms = '';			
		  	return h + ':' + m + ':' + s + ' ' + ms;
		},
		createSection:function() {
			var me = this;
			me.setState({section:{id:'new', track:{}}}, function() {
				me.popupEditVideo(me.props.params,{});
			});	
		},
		editSection:function(id) {
			var me = this;
			var o = me.state.sections, v = [];	
			for (var i = 0; i < o.length; i++) {
				if (o[i].id == id) {
					me.setState({section:o[i]});
					return true;
				}
			} 
			me.setState({section:null});
			return true;  			       
		},
		deleteSection:function(id) {
			var me = this;
			var o = me.state.sections, v = [];	
			for (var i = 0; i < o.length; i++) {
				if (o[i].id == id) continue;
				else v[v.length] = o[i]; 
			}
			me.setState({sections:v}, function() {
				me.submitCurriculum(me.props.params);
				me.setState({section:{track:{}}});
			});
			return true;       
		},		
		popupEditVideo: function(params, track) {
			var me = this;
			var id = new Date().getTime();
			if (track == 'new') {
				me.setState({section:{track:{}}}, function() {
					me.setState({ModalPlus:{type:'popup',  hold:0,
						box_style:{top:'28px'},
						title: (<span>Select video section</span>),
						message: (<Embed_video_editor parent={me} params={params} video={me.state.video} popid={new Date().getTime()} />),
						header:false,
						footer:(<span/>)
					}});					
				});

				return true;
			}
			me.setState({ModalPlus:{type:'popup',  hold:0,
				box_style:{top:'28px'},
				title: (<span>Video Editor</span>),
				message: (<Embed_video_editor parent={me} params={params} video={me.state.video} popid={new Date().getTime()} />),
				header:false,
				footer:(<span/>)
			}});			
			return true;
		},		
		componentDidMount:function() {
			var me = this;
			var vid = '';	
			if (me.props.params['opt'] == 'new') {
				vid = me.props.params['id'];
				me.getVideoInfo(vid,
					function(data) {
						me.setState({vid:vid, video:data.data[0]});
						me.leftBox(me.props.params);
						me.rightBox(me.props.params);				
					}
				);
			} else if (me.props.params['opt'] == 'edit') {
				var cid = me.props.params['id'];
				
				
				me.getCurriculumById(cid, function(data) {
					console.log(data);
					return true;
					if (data.vid) {
						me.setState({vid:data.vid, curriculum:data.curriculum,
						    sections:data.curriculum.script});
					} 
					me.leftBox(me.props.params);
					me.rightBox(me.props.params);
				});
			}
		},
		componentDidUpdate:function() {
			var me = this;
		},
		deleteCurriculum: function(params, track) {
			var me = this;
			var id = new Date().getTime();
			alert('delete--' + id);
			me.setState({ModalPlus:{type:'popup',  hold:0,
				box_style:{top:'28px'},
				header: (<span/>),		
				message: (<div className="container-fluid">
						<p>It is going to clean up the curriculum please confirm:</p>
						<button className="btn btn-danger btn_margin6 pull-right" onClick={me.execDeleteCurriculum.bind(me)}>Confirm</button>
						<button className="btn btn-warning btn_margin6 pull-right" onClick={me.closePopup.bind(me)}>Cancel</button>
					</div>),
				footer:(<span/>)
			}});			
			return true;
		},		
		execDeleteCurriculum:function() {
			var me = this;
			
			if ((me.state.curriculum) && (me.state.curriculum.id)) {
				me.props.route.env.engine({
					url: shusiou_config.api_server + '/api/shusiou_curriculum.js',
					method: "POST",
					data: {cmd:'delete', cid:me.state.curriculum.id},
					dataType: "JSON"
				}, function( data) {
					me.closePopup();
					me.componentDidMount();
					me.props.router.push('/tutor/my_curriculums');
				},function( jqXHR, textStatus ) {
					me.closePopup();
				});				
			} else {}
			
		},
		submitCurriculum:function(v, jump){
			var me = this;
			var data = {};
			
			if (me.state.curriculum.id) {
				data = {cmd:'update', id:me.state.curriculum.id, vid: me.state.curriculum.vid, 
					name:me.state.curriculum.name, 
					section:me.state.section,
					published:(me.state.curriculum.published)?me.state.curriculum.published:0,
				        sections:me.state.sections,
				        auth:me.props.route.env.state.auth
				};
			} else {
				data = {cmd:'add', vid: me.state.video.vid, name:me.state.curriculum.name, 
					mother_lang:me.state.curriculum.mother_lang, 
					learning_lang:me.state.curriculum.learning_lang, 
					level:me.state.curriculum.level, 					
				        sections:me.state.sections,
					auth:me.props.route.env.state.auth
				       };
			}
			
			me.props.route.env.engine({
				url: shusiou_config.api_server + '/api/curriculum/myCurriculum.api?opt=add',
				method: "POST",
				data: data,
				dataType: "JSON"
			}, function( data) {
				if ((data.data) && v === '') {
					me.props.router.push('/tutor/my_curriculum/edit/'+data.data);
					me.componentDidMount();
				//	window.location.reload();
				} else if (jump) {
					me.props.router.push('/tutor/my_curriculums');
				}
			},function( jqXHR, textStatus ) {
				console.log('error');
			});			
		},
		dictionary:function(v) {
			if (!this.props.route || !this.props.route.env ||!this.props.route.env.dictionary) return v;
			return this.props.route.env.dictionary(v);
		},
		getVideoInfo: function(vid, cbk) {
			var me = this;
			
			me.props.route.env.engine({
				url: shusiou_config.api_server + '/api/',
				method: "POST",
				data: { vid:vid},
				dataType: "JSON"
			}, function( data) {
				if (typeof cbk == 'function') {
					cbk(data);
				}
			},function( jqXHR, textStatus ) {
				console.log( "Request failed: " + textStatus );
			});			
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
				if (typeof cbk == 'function') {
					console.log(data);
					cbk(data);
				}
			},function( jqXHR, textStatus ) {
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
		closePopup:function() {
			var me = this;
			me.setState({ModalPlus:'cancel'});			
			return true;
		},
		abortSection: function() {
			var me = this;
			me.setState({section:{track:{}}});
			me.componentDidMount();
		},		
		acceptSection: function(v) {
			var me = this;
	
			var o = me.state.sections;
			var v1 = JSON.parse(JSON.stringify(me.state.section));		
			v1.o = v;
			if (v1.id != 'new') {
				for (var i = 0;  i < o.length; i++) {
					if (o[i].id == v1.id) {
						o[i] = v1;
						break;
					}
				}
				
			} else {
				v1.id = new Date().getTime() + '_' + o.length;
				o[o.length] = v1;
				
			}
			
			me.setState({sections:o}, function() {
				me.submitCurriculum(me.props.params);			
				me.setState({section:{track:{}}});			
			});
		},		
		render: function() {
			var me = this;
			return (
				<div className="content_section">
					<br/>
					{me.mainBox()}
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
