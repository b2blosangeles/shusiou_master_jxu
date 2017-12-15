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
					ans:{text:'Your answer', lang:'en-US', active:true},					
					match:[
						{text:'Good Job', lang:'cn-ZH', active:true},
					],
					non_match:[
						{text:'Incorrect, please try again.', lang:'en-US', active:false},
						{action:'play video', active:true}, 
						{text:'Please try again.', lang:'en-US', active:false}					
					],
					done:{text:'Lets continue', lang:'en-US', active:true}
				};
			return {
				form_value:{text:''},
				c_section:me.default
			};
		},
		componentDidMount:function() {
			var me = this;
			alert(12);
			if (me.props.section.id == 'new') {
				me.setState({c_section:me.default});
			} else me.setState({c_section:me.props.section.o});
		},
		componentDidUpdate:function(prePropos, preState) {	
			var me = this;	
			if (me.props.section.id != prePropos.section.id) {	
 				// me.setState({c_section:me.props.parent.state.section.o});	
				if (me.props.section.id == 'new') {
					me.setState({c_section:me.default});
				} else me.setState({c_section:me.props.section.o});
 			}				
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
		recField: function(rec) {
			var me = this;
			if (!rec.action) return (
				<span>
					<table className="textRecField" width="100%"  style={{border:'0px solid transparent'}}>
						<tr>
							<td><input className="form-control inpit-white-bg" 
									placeholder="Input text likes The next paragraph is telling sometning" 
									value={rec.text}  onChange={this.handleChange.bind(this, rec)}  />
							</td>
							<td width="80">
								{me.langField(rec)}
							</td>
							{/*<td width="28">
								<div className="checkbox_div  inpit-white-bg" onClick={me.handleActive.bind(me,rec)}>
									{
									(function() {
										if (rec.active)  return (<i className="fa fa-check" aria-hidden="true"></i>)
									})()
									}
								</div>	
							</td>*/}							
						</tr>
					</table>
				</span>
				)
			else return (
				<span>
					<table className="textRecField" width="100%" style={{border:'0px solid transparent'}}>
						<tr>
							<td className="td_middle"><i className="fa fa-film" aria-hidden="true" ></i> {/*rec.action*/} 
								{
								(function() {
									if (rec.active) return (<span dangerouslySetInnerHTML=
									{{__html: 'Start: ' + me.props.parent.toHHMMSS(me.props.parent.state.section.track.s) + 
										' To:' + me.props.parent.toHHMMSS(me.props.parent.state.section.track.s + 
											me.props.parent.state.section.track.t)}}
									/>)
								})()}
								&nbsp;&nbsp;
								<button className="btn btn-info btn-xs" 
									onClick={me.props.parent.popupEditVideo.bind(me, me.props.params, me.props.parent.state.section.track)}>
								<i className="fa fa-scissors" aria-hidden="true"></i> Clip video
								</button>		

															
							</td>
							{/*<td width="28">
								<div className="checkbox_div inpit-white-bg" onClick={me.handleActive.bind(me,rec)}>
									{
									(function() {
										if (rec.active) return (<i className="fa fa-check" aria-hidden="true"></i>)	
									})()
									}									
								</div>	
							</td>*/}								
						</tr>
					</table>
				</span>		
			)	
		},							
		render: function() {
			var me = this;
			return (
				<span>
					{me.props.parent.state.curriculum.mother_lang} - {me.props.parent.state.curriculum.learning_lang} - {me.props.parent.state.curriculum.level}
					==niu==
					<table width="100%" className="section_template_frame">						
						<tr className="bg_op_warning">
							<td width="8"></td>
							<td width="60">Prompts</td>
							<td valign="top" style={{'padding-right':'7px'}}>
								{me.state.c_section.pro.map( function(m) {
									return me.recField(m);	
								})}
							</td>
						</tr>						
						<tr className="bg_op_success">
							<td width="8"></td>
							<td width="60">Answer</td>
							<td valign="top" style={{'padding-right':'7px'}}>
								{me.recField(me.state.c_section.ans)}	
							</td>
						</tr>
						<tr className="bg_op_success">
							<td width="8"></td>
							<td width="60"></td>
							<td valign="top">
								<table width="100%">
									<tr  style={{border:'1px solid #ccc'}}>
										<td width="30">Match:</td>
										<td>
											{me.state.c_section.match.map( function(m) {
												return me.recField(m);	
											})}
										</td>										
									</tr>
									<tr style={{border:'1px solid #ccc'}}>
										<td width="30">Mismatch:</td>
										<td>
											{me.state.c_section.non_match.map( function(m) {
												return me.recField(m);	
											})}
										</td>										
									</tr>									
								</table>	
							</td>
						</tr>						
						<tr className="bg_op_warning">
							<td width="8"></td>
							<td width="60">Last</td>
							<td valign="top" style={{'padding-right':'7px'}}>
								{me.recField(me.state.c_section.done)}
							</td>
						</tr>							
					</table>					
					
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
				</span>
				
			)
		}
	});	
	
} catch (err) {
	console.log(err.message);
}
