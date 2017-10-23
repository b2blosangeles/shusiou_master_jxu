try {
	var MyCurriculumById =  React.createClass({
		getInitialState: function() {
			var me = this;
			return {text:_DATA_["/data/home_page.json"], 
				list:[
				  ],
				c_text:'abc', 
				c_section:{s:3, t:10, q:[
						{text:'The next paragraph is saying a woman Landloard in California.', lang:'en-US'},
						{text:'Listen', lang:'en-US'},
						{video:'/api/lang_space/vr_cut.js?video=sample.mp4|3|4', text:'How are you'},

						{text:'Please repeat:', lang:'en-US'},
						{answer:'加州房姐', lang:'zh-CN', message:'waiting for answer ...', 
							match: [{text:'Excellent!', lang:'en-US'}],
							nomatch: [
								{text:'Wrong! listen again', lang:'en-US'},
								{video:'/api/lang_space/vr_cut.js?video=sample.mp4|35|3', text:'How are you'},
								{text:'please repeat', lang:'en-US'}
								]
						},
						{text:'Lets continue.', lang:'en-US'}
					]					
				},
				video:{}
			};
		},	
		componentDidMount:function() {
			var me = this;
			$('.video_ad').attr('autoplay', true).attr('loop', true);
			$(".video_ad").attr("src", "http://virtual_language_lab.qalet.com/api/lang_space/vr.js?video=sample.mp4");
			
			me.dataApi('get');
			
			var INV = setInterval(
				function(){ 

					$.ajax({
						url: '/api/lang_space/vimage_lazy_cache.js?video=sample.mp4',
						method: "POST",
						data: { },
						dataType: "JSON"
					}).done(function( data) {
						me.setState({video:{length:data.video_length, q:data.q}});
						if (!data.q) {
							clearInterval(INV);
						}
						console.log(data);
					}).fail(function( jqXHR, textStatus ) {
						console.log( "Request failed: " + textStatus );
					});

			}, 1500);			
			
		},
		componentDidUpdate:function() {
			var me = this;
			if (me.state.c_t) {
				me.playCut();
			}
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
		textStyle:function() {
			var me = this;
			if (me.props.route.env.state.Breakpoint == 'sm' || me.props.route.env.state.Breakpoint == 'sx') {
				return {'font-size':'0.8em'}
			} else {
				return {'font-size':'1em'}	
			}
		},
		jumpSS: function(v) {
			if (this.state.c_s) this.setState({c_s:this.state.c_s+v});
		},
		jumpTO: function(v) {
			this.setState({c_t:this.state.c_t+v});
		},			
		pickVideo: function(s, t) {
			var me = this;
			if (s == null) {
				var c = $('#preview_video')[0].currentTime;
				me.setState({c_s:Math.floor(c), c_t:10, c_text:'', c_id:null});
			} else {
				var a = me.state.list;
				for (var i = 0; i < a.length; i++) {
					if (s == a[i].s && t == a[i].t) {
						me.setState({c_s:s, c_t:t, c_text:a[i].text, c_id:i});
					}
				}
			}
			$('#preview_video')[0].pause();
		},
		showCut: function() {
			var me = this, A = [];
			for (var i = 0; i < me.state.c_t; i++) A[A.length] = me.state.c_s + i;
			return A.map(function(a){
				var v = '/api/lang_space/vr_img.js?video=sample.mp4|'+a;		
				return (<img src={v} width="90"/>)	       
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
		saveCut: function() {
			var me = this, A = me.state.list;
			if (!me.state.c_text) return false;
			if (me.state.c_id !=null) {
				A[me.state.c_id] = {s:me.state.c_s, t:me.state.c_t, text:me.state.c_text};
			} else {	
				A[A.length] = {s:me.state.c_s, t:me.state.c_t, text:me.state.c_text};
			}	
			me.setState({c_s:null, c_t:null, c_text:null, list:A});
			$('#cut_video')[0].pause();
			me.dataApi('save');
		},
		deleteCut: function() {
			var me = this, A = me.state.list, B = [];
			if (me.state.c_id != null) {
				for (var i = 0; i < A.length; i++) {
					if (me.state.c_id != i) {
						B[B.length] = A[i];
					}
				}
				me.setState({c_s:null, c_t:null, c_text:null, c_id:null, list:B});
			} else {
				me.setState({c_s:null, c_t:null, c_text:null, c_id:null});
			}
			$('#cut_video')[0].pause();
			me.dataApi('save');
		},		
		showList: function() {
			var me = this;
			return me.state.list.map(function(a){		
				return (
				<span>	
					<p>
						<a className="pull-right" href="JavaScript:void(0)" onClick={me.pickVideo.bind(this, a.s, a.t)}>
							{a.s} -- {a.t + a.t}</a>	
						{a.text}
					</p>
				</span>			
				)	       
			});
		},		
		playCut:function() {
			var me = this, v = '/api/lang_space/vr_cut.js?video=sample.mp4|' + 
			    	me.state.c_s + '|' + me.state.c_t;
			$('#cut_video')[0].src = v;
			$('#cut_video')[0].play();		
		},
		preCacheImage:function() {
			var me = this;
		},
		editSection:function() {
			var me = this;
			/*
			me.setState({ModalLoading:{ 
						box_style:{top:'80px', color:'red', 'font-size':'1em'}, backdrop:false, hold:500
				//	       message:'<span style="color:red">test message</span>',
				//		backdrop:true
					//	tm:new  Date().getTime()
					       }});
			
			setTimeout(
				function() {
					me.setState({ModalLoading:'cancel'});
				}, 8000
			
			);
			*/
			me.setState({ModalPlus:{type:'popup',  hold:0,
				box_style:{top:'28px'},
				title: (<TemplateFollowMe_head parent={me} />),
				message: (<TemplateFollowMe_body parent={me} />)
			}});
					       
		},
		render: function() {
			var me = this;
			return (
				<div className="content_section">
					<br/>
					<div className="container">
						<div className="col-sm-4 col-lg-4 col-md-4"> 
							<div className="overlayer_box editor_box">
								<h4 className="header">{me.dictionary('my_curriculum')}</h4> 								
								
								<p className="overlayer_box_body" style={me.textStyle()}
									dangerouslySetInnerHTML={{__html: ''}} />
								<p> 
									<video id="preview_video" width="100%" height="180" controls>
										<source src="/api/lang_space/vr.js?video=sample.mp4" 
										type="video/mp4"/>
									</video>									
								</p>
								<button type="button" className="btn btn-warning" onClick={me.pickVideo.bind(this, null, null)}>
									<i className="fa fa-scissors" aria-hidden="true"></i> Cut
								</button>
								&nbsp;
								{/*
								<button type="button" className="btn btn-danger" onClick={me.preCacheImage.bind(this)}>
									<i class="fa fa-picture-o" aria-hidden="true"></i> Pre-cache image
								</button>
								*/}
								<span className="pull-right text-warning" style={{'padding-top':'0.5em'}}>
									{(function() {
										if ((me.state.video.length) && (me.state.video.q)) {
										  	return 'Lazy caching ...';
										} else {
											return '';
										}
									})()}									
									
								</span>	
							</div>	
						</div>
						
						<div className="col-sm-5 col-lg-5 col-md-5"> 
							<div className="overlayer_box editor_box">
								<video id="cut_video" width="280" height="80" controls style={{display:'none'}}>
									<source src="" type="video/mp4"/>
								</video>
								{(function()  {
									if (me.state.c_s != null) 
									return (<p>
											<button type="button" style={me.saveAble()}
												className="btn btn-warning video_editor_button pull-right" 
												onClick={me.saveCut.bind(this)}>
												<i classNme="fa fa-caret-square-o-left" aria-hidden="true"></i>
												Save
											</button>
											<button type="button" 
												className="btn btn-warning video_editor_button pull-right" 
												onClick={me.deleteCut.bind(this)}>
												<i classNme="fa fa-caret-square-o-left" aria-hidden="true"></i>
												Remove
											</button>
											<button type="button" 
												className="btn btn-warning video_editor_button pull-right" 
												onClick={me.editSection.bind(this)}>
												<i class="fa fa-pencil" aria-hidden="true"></i>
												Edit
											</button>											
											<p>
												Start:{me.state.c_s} &nbsp;&nbsp; Length:{me.state.c_t}
											</p>	
										</p>)
								})()}
								
								{(function() {
									if (me.state.c_s != null) 
									return (<p>
									<textarea onChange={this.handleTextChange} 
										className="form-control" rows="3">{me.state.c_text}</textarea>		
									</p>)
								})()}
								

								{(function() {
									if (me.state.c_s != null)
									return (
										<p>
											<button type="button" className="btn btn-success video_editor_button" 
												onClick={me.jumpTO.bind(this,-1)}>
												<i classNme="fa fa-caret-square-o-left" aria-hidden="true"></i>
												-1/2 sec
											</button>
											<button type="button" className="btn btn-success video_editor_button" 
												onClick={me.jumpTO.bind(this,1)}>
												<i classNme="fa fa-caret-square-o-left" aria-hidden="true"></i>
												+1/2 sec
											</button>
											<button type="button" className="btn btn-success video_editor_button" 
												onClick={me.playCut.bind(this)}>
												<i classNme="fa fa-play" aria-hidden="true"></i>
												Play Cut
											</button>									
										</p>
									)
								})()}
								
								<p className="video_editor">
								{me.showCut()}
								</p>
								
							</div>	
						</div>	
						<div className="col-sm-3 col-lg-3 col-md-3"> 
							<div className="overlayer_box editor_box">
								{me.showList()}
							</div>	
						</div>						
					</div>	
					<div className="content_bg opacity_bg">
						
						{/*
						<video id="video_ad" className="video_ad"  src=""></video>
						*/}
					</div>
					<ModalPlus parent={me} />
					{/*
					<ModalWin parent={me} />
					<ModalLoading parent={me} />
					*/}
				</div>
			)
		}
	});	
	
} catch (err) {
	console.log(err.message);
}
