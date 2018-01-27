try {		
	var TemplateSectionForm =  React.createClass({
		getInitialState: function() {
			var me = this; 
			return {
				scriptLangs:[],
				scriptList:[],
				scriptListFilter:{},
				script_id:0,
				data:{},
				c_tpl:{}
			};
		},
		componentDidMount:function() {
			var me = this;
			me.props.parent.props.route.env.engine({
				url: '/api/content_data/getScripts.api',
				method: "POST",
				data: {cmd:'getAll', auth:me.props.parent.props.route.env.state.auth},
				dataType: "JSON"
			}, function( data) {
				console.log(data);
				me.setState({scriptLangs:data.langs, scriptList:data.list});
			},function( jqXHR, textStatus ) {
				console.log('error');
			});				
			me.setTpl({});
		},
		componentDidUpdate:function(prePropos, prevState) {	
			var me = this;
			if (me.state.script_id  !== prevState.script_id) {
				me.loadScriptById(me.state.script_id);
			}
		
			if (me.props.section_id !== prePropos.section_id) {
				me.setTpl({});
			}
		},
		loadScriptById:function(id) {
			var me = this;
			me.props.parent.props.route.env.engine({
				url: '/api/content_data/getScripts.api',
				method: "POST",
				data: {cmd:'getScriptById', id: id, auth:me.props.parent.props.route.env.state.auth},
				dataType: "JSON"
			}, function( data) {
				console.log(data);
				me.setState({c_tpl:data});
			},function( jqXHR, textStatus ) {
				console.log('error');
			});			
		},
		
		
		handleChange(idx, event) {
			var me = this, v = me.state.data;
			
			var v = me.state.data;
			if (event.target.type == 'text') {
				v[idx] = event.target.value;
			}
			/*
			if (event.target.type == 'checkbox') {
				rec.sctive = event.target.checked;
			} 
			*/
			me.setState({data:v});
		},
		/*
		handleActive(rec) {
			var me = this;
			if (rec.active) {
				rec.active = false;
			} else {
				rec.active = true;
			}
			var v = me.state.c_section;
			this.setState({c_section:v});
		},		
		*/
		setTpl(data) {
			var me = this;
			if (me.props.section.id == 'new') {
				me.setState({c_tpl:data});
				// alert(me.props.section.id);
			} else me.setState({c_tpl:me.props.section.o});
		},
		popupEditVideo: function(params, track) {
			var me = this;
			var id = new Date().getTime();
			if (track == 'new') {
				me.setState({section:{track:{}}}, function() {
					me.setState({ModalPlus:{type:'popup',  hold:0,
						box_style:{top:'28px'},
						title: (<span>Select video section</span>),
						message: (<Embed_video_editor parent={me} params={params} popid={new Date().getTime()} />),
						header:false,
						footer:(<span/>)
					}});					
				});

				return true;
			}
			me.setState({ModalPlus:{type:'popup',  hold:0,
				box_style:{top:'28px'},
				title: (<span>Video Editor</span>),
				message: (<Embed_video_editor parent={me} params={params} popid={new Date().getTime()} />),
				header:false,
				footer:(<span/>)
			}});			
			return true;
		},	
		
		setScriptListFilter(p) {
			let me = this, o = me.state.scriptListFilter;
			if (p.id) {
				me.setState({script_id:p.id});
			}
			for (var k in p)  o[k] = p[k];
			me.setState({scriptListFilter:o});
		},
		langField: function(rec) {
			var me = this;
			return (
				<div className="dropdown">
				  <button className="btn btn-default dropdown-toggle  inpit-white-bg" type="button" data-toggle="dropdown">
					  {rec.lang}&nbsp;
				  <span className="caret"></span></button>
				  <ul className="dropdown-menu">
				    <li><a href="JavaScript:void(0)" onClick={me.handleLang.bind(me, rec, me.state.c_section.lang.mother)}> {me.state.c_section.lang.mother}</a></li>
				    <li><a href="JavaScript:void(0)" onClick={me.handleLang.bind(me, rec, me.state.c_section.lang.learning)}> {me.state.c_section.lang.learning}</a></li>
				  </ul>
				</div>	
			)	       
		},
		textField: function(idx) {
			var me = this;
			return (
				<input className="form-control inpit-white-bg" 
				placeholder="Input text likes The next paragraph is telling sometning" 
				value={me.state.data[idx]}  onChange={me.handleChange.bind(me, idx)}  />			
			)	       
		},
		acceptSection: function() {
			let me = this;
			let data = {section_id:me.props.section_id, tpl:me.state.c_tpl, data:me.state.data, c_section:me.state.c_section, track:me.props.section};
			alert(JSON.stringify(data));
		},
		
		templateSelectScript: function() {
			let me = this, scriptLangs = me.state.scriptLangs, scriptList = me.state.scriptList;
			return (
				<span>
				<table className="textRecField" width="100%"  style={{border:'0px solid transparent'}}>
				<tr>
					<td>
						<div className="dropdown">
						  <button className="btn btn-default dropdown-toggle  inpit-white-bg" type="button" data-toggle="dropdown">
							  {(me.state.scriptListFilter.lang)?me.state.scriptListFilter.lang:'Select Language Solution'} 
							  <span className="caret"></span></button>						
						  <ul className="dropdown-menu">					  
							{scriptLangs.map(function(m) {
							return (<li><a href="JavaScript:void(0)" onClick={me.setScriptListFilter.bind(me, {lang:m})}>{m}</a></li>);	
							})}
						  </ul>
						</div>						
					</td>
					<td>
						<div className="dropdown">
						  <button className="btn btn-default dropdown-toggle  inpit-white-bg" type="button" data-toggle="dropdown">
							   {(me.state.script_id)?me.state.script_id:'Select Script'} 
						  <span className="caret"></span></button>
						  <ul className="dropdown-menu">					  
							{scriptList.map(function(m) {
								if (!me.state.scriptListFilter.lang || me.state.scriptListFilter.lang == m.lang) {
								return (<li><a href="JavaScript:void(0)" onClick={me.setScriptListFilter.bind(me, {id:m.id})}>{m.description}</a></li>);	
								} 
							})}
						  </ul>
						</div>								
					</td>						
				</tr>
				</table>
				</span>	
			)	       
		},
		tplSection : function (rec) {
			let me = this;
			if (me.state.c_tpl.variables) {
				return (
					<span>		
					{me.state.c_tpl.variables.map(function(v) {
						switch(v) {
							case '$section':
								return (
								<span>
									{(function() {
										return (<span dangerouslySetInnerHTML=
										{{__html: 'Start: ' + me.props.parent.toHHMMSS(me.props.parent.state.section.track.s) + 
											' To:' + me.props.parent.toHHMMSS(me.props.parent.state.section.track.s + 
												me.props.parent.state.section.track.t)}}
										/>)
									})()}	
									me.props.parent.popupEditVideo.
									<button className="btn btn-info btn-xs" 
										onClick={me.popupEditVideo.bind(me, me.props.params, me.props.parent.state.section.track)}>
									<i className="fa fa-scissors" aria-hidden="true"></i> Clip video
									</button>										
								</span>
								);
								break;								
							case '$answer':
								return me.textField(v);
								break;
							 default:
								return '-- undefined variable' + v + ' --';
						}
					})}
					<table width="100%" className="section_template_frame">	
						<tr className=""><td>
							<div className="container-fluid" style={{padding:'6px', 'text-align':'center'}}>
								{(function() {
									if (me.props.parent.state.section.id != 'new') return (<button className="btn btn-danger" 
									onClick={me.props.parent.deleteSection.bind(me, me.props.parent.state.section_id)}>Delete This Section</button>)
								})()}	
								<button className="btn btn-default pull-left" onClick={me.props.parent.abortSection.bind(me)}>Abort Change</button>
								<button className="btn btn-info pull-right" onClick={me.acceptSection.bind(me)}>Save</button>
							</div>
						</td></tr>	
					</table>						
					</span>)
			} else {
				return (<span>select a script</span>)
			}
		},							
		render: function() {
			var me = this;
			return (<span>
				{me.props.parent.state.curriculum.mother_lang} - ||
				{me.props.parent.state.curriculum.learning_lang} - 
				{me.props.parent.state.curriculum.level}
				{me.templateSelectScript()}
				{me.tplSection()}
				<hr/>
				{JSON.stringify(me.state.c_tpl)}
				<ModalPlus parent={me} />
				</span>)
		}
	});	
	
} catch (err) {
	console.log(err.message);
}
