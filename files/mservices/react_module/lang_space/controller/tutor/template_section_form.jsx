try {		
	var TemplateSectionForm =  React.createClass({
		getInitialState: function() {
			var me = this; 
			me.default = {
				lang:{mother:'en-US', learning:'cn-ZH'},
				pro:[
					{text:'The next paragraph is saying something[s]Listen', lang:'en-US', active:true},
					{action:'play video', active:true}, 
					{text:'Please repeat', lang:'en-US', active:false}
				],
				ans:{text:'你好', lang:'cn-ZH', active:true},					
				match:[
					{text:'good job', lang:'en-US', active:true},
				],
				non_match:[
					{text:'Incorrect, please try again.', lang:'en-US', active:false},
					{action:'play video', active:true}, 
					{text:'Please try again.', lang:'en-US', active:false}					
				],
				done:{text:'Lets continue', lang:'en-US', active:true}
			};
			return {
				langs:[],
				list:[],
				form_value:{text:''},
				//c_section:me.default,
				c_section:{},
				script_id:0,
				tpl:{},
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
				me.setState({langs:data.langs, list:data.list});
			},function( jqXHR, textStatus ) {
				console.log('error');
			});				
			console.log('me.props.section--');
			console.log(me.props.section);
			if (me.props.section.id == 'new') {
				alert(me.props.section.id);
				// me.setState({c_section:me.default});
				me.setState({c_section:me.state.tpl});	
			} else me.setState({c_tpl:me.props.section.o});
		},
		componentDidUpdate:function(prePropos, prevState) {	
			var me = this;
			if (me.state.script_id  !== prevState.script_id) {
				me.loadScriptById(me.state.script_id);
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
		handleChange(rec, event) {
			var me = this;
			var v = me.state.c_section;
			if (event.target.type == 'text') {
				rec.text = event.target.value;
			}
			if (event.target.type == 'checkbox') {
				rec.sctive = event.target.checked;
			} 			
			this.setState({c_section:v});
		},
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
		handleLang(rec, v) {
			var me = this;
			rec.lang = v;
			var o = me.state.c_section;		
			this.setState({c_section:o});
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
		textField: function(rec) {
			var me = this;
			return (
				<input className="form-control inpit-white-bg" 
				placeholder="Input text likes The next paragraph is telling sometning" 
				value={rec.text}  onChange={this.handleChange.bind(this, rec)}  />
							
			)	       
		},
		handleTpl: function(p) {
			let me = this, o = me.state.tpl;
			if (p.id) {
				me.setState({script_id:p.id});
			}
			for (var k in p)  o[k] = p[k];
			me.setState({tpl:o});
			console.log(me.state.tpl);
			console.log('me.state.tpl');
		},
		templateSelectScript: function() {
			let me = this, langs = me.state.langs, list = me.state.list;
			return (
				<span>
				<table className="textRecField" width="100%"  style={{border:'0px solid transparent'}}>
				<tr>
					<td>
						<div className="dropdown">
						  <button className="btn btn-default dropdown-toggle  inpit-white-bg" type="button" data-toggle="dropdown">
							  {(me.state.tpl.lang)?me.state.tpl.lang:'Select Language Solution'} 
							  <span className="caret"></span></button>						
						  <ul className="dropdown-menu">					  
							{langs.map(function(m) {
							return (<li><a href="JavaScript:void(0)" onClick={me.handleTpl.bind(me, {lang:m})}>{m}</a></li>);	
							})}
						  </ul>
						</div>						
					</td>
					<td>
						<div className="dropdown">
						  <button className="btn btn-default dropdown-toggle  inpit-white-bg" type="button" data-toggle="dropdown">
							   {(me.state.tpl.id)?me.state.tpl.id:'Select Script'} 
						  <span className="caret"></span></button>
						  <ul className="dropdown-menu">					  
							{list.map(function(m) {
								if (!me.state.tpl.lang || me.state.tpl.lang == m.lang) {
								return (<li><a href="JavaScript:void(0)" onClick={me.handleTpl.bind(me, {id:m.id})}>{m.description}</a></li>);	
								} // else return (<li>---</li>);
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
									<button className="btn btn-info btn-xs" 
										onClick={me.props.parent.popupEditVideo.bind(me, me.props.params, me.props.parent.state.section.track)}>
									<i className="fa fa-scissors" aria-hidden="true"></i> Clip video
									</button>										
								</span>
								);
								break;								
							case '$answer':
								return me.textField({});
								// me.state.c_section.ans
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
									onClick={me.props.parent.deleteSection.bind(me, me.props.parent.state.section.id)}>Delete This Section</button>)
								})()}	
								<button className="btn btn-default pull-left" onClick={me.props.parent.abortSection.bind(me)}>Abort Change</button>
								<button className="btn btn-info pull-right" onClick={me.props.parent.acceptSection.bind(me, me.state.c_section)}>Save</button>
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
				{me.props.parent.state.curriculum.mother_lang} - 
				{me.props.parent.state.curriculum.learning_lang} - 
				{me.props.parent.state.curriculum.level}
				{me.templateSelectScript()}
				{me.tplSection()}
					<hr/>
					{JSON.stringify(me.state.c_tpl)}
				</span>)
		}
	});	
	
} catch (err) {
	console.log(err.message);
}
