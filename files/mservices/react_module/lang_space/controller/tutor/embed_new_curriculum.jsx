try {
	var Embed_new_curriculum =  React.createClass({
		getInitialState: function() {
			var me = this;
			return {curriculum:{},
				langs:me.props.parent.state.langs,
				levels:me.props.parent.state.levels,
				list:[]
			       };
		},
		componentDidMount:function() {
			var me = this;
			me.getVideos();
		},

		checkVideo:function(v) {
			var me = this;
			me.props.parent.setState({video:v});	
		},
		getVideos:function() {
			var me = this;
			console.log('---me.props.route--');
			console.log(me.props.parent.route.env.state.auth);
			
			$.ajax({
				url: shusiou_config.api_server + '/api/video/myVideo.api?opt=getMyActiveVideos',
				method: "POST",
				data: {uid:2, token:'xxxxx'},
			//	data: me.props.route.env.state.auth,
				dataType: "JSON"
			}).done(function( data) {
				me.setState({list:data.data});
				console.log(data);
			}).fail(function( jqXHR, textStatus ) {
				console.log('error');
			});			
		},
		bgFilmStyle:function(rec) {
			if (rec.node_ip.length) {
				var idx = Math.floor(Math.random()*rec.node_ip.length);
				var url = 'http://' + rec.node_ip[idx] + '/api/video/play_stream.api?type=image&vid=' + rec.vid + '&s=20&w=90&server=' + rec.server_ip;
			} else {	
				var url = 'http://' + rec.server_ip + '/api/video/play_stream.api?type=image&vid=' + rec.vid + '&s=20&w=90';
			}
			return {width:'90px', background:'url('+url+')',
				'background-size':'cover'}
		},		
		save:function(e) {
			var me = this;
			me.props.parent.setState({curriculum:me.state.curriculum}, function() {
				me.props.parent.submitCurriculum('', true);	
			});
		},		
		cancelToSave:function() {
			var me = this;
			me.props.parent.props.router.push('/tutor/my_curriculums');
		},		
		valueChanged:function(code, e) {
			var me = this, curriculum = me.state.curriculum;
			curriculum[code] = e.target.value;
			me.setState(curriculum);
		},
		validation:function() {
			var me = this;
			if (!me.state.curriculum.name || !me.state.curriculum.learning_lang || !me.state.curriculum.mother_lang ||  !me.state.curriculum.level ||
			   !me.props.parent.state.video.id) {
				return false;
			} else {
				return true;
			}
		},
		saveButton:function() {
			var me = this;
			if (me.validation()) return (
				<button className="btn btn-warning btn_margin6"
					onClick={this.save.bind(this)}>Save</button>
				)
			else return (<button className="btn btn-warning btn_margin6" disabled>Save</button>)
		},		
		render: function() {
			var me = this;
				return (<div>
						<h4>Add New Curriculum</h4> 
						<div className="form-group">
							<div className="dropdown">
							 	<button className="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown">  
								{(function(){ 		
								if ((me.props.parent.state.video) && (me.props.parent.state.video.code)) return(	  
								<table className="container-fluid">
									<tr>
										<td width="90" valign="top">
											<img src="/images/film_bg.png" style={me.bgFilmStyle(me.props.parent.state.video)} width="90"/>
										</td>
										<td  width="6"></td>
										<td style={{'text-align':'left',whiteSpace: 'normal',wordWrap: 'break-word', 
												'line-height':'1.2em'}}>
											{me.props.parent.state.video.title}
										</td>
										<td  width="6"></td>
										<td  width="12"><span className="caret"></span></td>			
									</tr>		
								</table>)
								else return (<span>Select video <span className="caret"></span></span>)	  
								  })()}		  
							  	</button>
							  <ul className="dropdown-menu" style={{'min-width':'480px', 'max-height': '360px', 'overflow':'auto'}}>
								{me.state.list.map(function(a){ 
									return (
									 <li><a href="JavaScript:void(0)" onClick={me.checkVideo.bind(me,a)}>
									<table width="100%" style={{'margin-bottom':'6px'}}>
										<tr>
											<td width="100" valign="top">
												<img src="/images/film_bg.png" style={me.bgFilmStyle(a)}  width="90"/>
											</td>
											<td  width="6"></td>
											<td  style={{'text-align':'left',whiteSpace: 'normal',wordWrap: 'break-word',
													'line-height':'1.2em'}}>
												{a.title}<br/>
												<b>Length</b>:{a.length} (secs)<b>Streaming size</b>:{a.size}												
											</td>
										</tr>		
									</table>
									</a></li>		
									)
								})}  		  
							  </ul>
							</div>
						</div>	
						
						
						<div className="form-group">
							<label>Curriculum Name:</label>
							<input type="text" className="form-control inpit-white-bg" 
								value={me.state.curriculum.name}
								onChange={this.valueChanged.bind(this, 'name')}
								aria-label=""/>
						</div>						

						<div className="form-group">
							<label>Mother Language:</label>
							<select className="form-control inpit-white-bg"
								onChange={me.valueChanged.bind(me, 'mother_lang')}>
								>
								<option value="">--Select Mother Language--</option>
								{me.state.langs.map(
									function(lang) {	
										return (<option value={lang.code}>{lang.desc}</option>);
								})}
							</select>
						</div>							

						
						<div className="form-group">
							<label>Learning Language:</label>
							<select className="form-control inpit-white-bg" 
								onChange={me.valueChanged.bind(me, 'learning_lang')}>
								<option value="">--Select Learning Language--</option>
								{me.state.langs.map(
									function(lang) {
										if (me.state.curriculum.mother_lang !=lang.code)	
										return (<option value={lang.code}>{lang.desc}</option>);
								})}
							</select>
						</div>													

						<div className="form-group">
							<label>Level:</label>
							<select className="form-control inpit-white-bg" 
								onChange={me.valueChanged.bind(me, 'level')}>
								<option value="">--Select Training Level--</option>
								{me.state.levels.map(
									function(level) {	
										return (<option value={level.code}>{level.desc}</option>);
								})}
							</select>
						</div>																			
						
						<button className="btn btn-default btn_margin6"
							onClick={this.cancelToSave.bind(this)}>Cancel</button>	
						{me.saveButton()}

					</div>)
		}
	});
	
	
} catch (err) {
	console.log(err.message);
}
