try {		
	var TemplateFollowMe_body =  React.createClass({
		
		getInitialState: function() {
			return {
				form_value:{text:''},
				c_section:{
				//	track:this.props.section,
					lang:{mother:'en-US', learning:'cn-ZH'},
					pro:[
						{text:'The next paragraph is saying a woman Landloard in California.[s]Listen', lang:'en-US', active:true},
						{action:'play video', active:true}, 
						{text:'Listen', lang:'en-US', active:false}
					],
					ans:{text:'The next paragraph is saying a woman Landloard in California.[s]Listen', lang:'en-US', active:true},					
					match:[
						{text:'The next paragraph is saying a woman Landloard in California.[s]Listen', lang:'en-US', active:true},
					],
					non_match:[
						{text:'The next paragraph is saying a woman Landloard in California.', lang:'en-US', active:false},
						{action:'play video', active:true}, 
						{text:'The next paragraph is saying a woman Landloard in California.', lang:'en-US', active:false}					
					],
					done:{text:'The next paragraph is saying a woman Landloard in California.[s]Listen', lang:'en-US', active:true}
				}
			};
		},
		componentDidMount:function() {
			var me = this;
			console.log('---me.props.section-A->');
			console.log(me.state.c_section);
		},
		componentDidUpdate:function(prePropos, preState) {
			var me = this;
			var o = me.state.c_section;
			return false;
			if (me.props.section.s != me.state.c_section.track.s || me.props.section.t != me.state.c_section.track.t) {
				o.track = me.props.section;
				console.log('---me.props.section-B->');
				console.log(me.props.section);	
				me.setState({c_section:o});
			}
			
		},		
		handleChange(rec, event) {
			var me = this;
			var v = me.state.c_section;
			console.log(event.target.value);
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
				  <button className="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown">
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
				<div className="container-fluid">
					<table className="textRecField" width="100%">
						<tr>
							<td>
								<input className="form-control" 
									placeholder="Input text likes The next paragraph is telling sometning" 
									value={rec.text}  onChange={this.handleChange.bind(this, rec)}  />
							</td>
							<td width="80">
								{me.langField(rec)}
							</td>
							<td width="28">
								<div className="checkbox_div" onClick={me.handleActive.bind(me,rec)}>
									{
									(function() {
										if (rec.active)  return (<i className="fa fa-check" aria-hidden="true"></i>)
									})()
									}
								</div>	
							</td>							
						</tr>
					</table>
				</div>	
				)
			else return (
				<div className="container-fluid">
					<table className="textRecField" width="100%">
						<tr>
							<td>
								<i className="fa fa-film" aria-hidden="true"></i> {rec.action} 
							</td>
							<td width="28">
								<div className="checkbox_div" onClick={me.handleActive.bind(me,rec)}>
									{
									(function() {
										if (rec.active) return (<i className="fa fa-check" aria-hidden="true"></i>)
									})()
									}
								</div>	
							</td>								
						</tr>
					</table>
				</div>				
			)	
		},							
		render: function() {
			var me = this;
			return (
				<span> niu
					{/*
					<table width="100%" className="section_template_frame">
						<tr className="bg-warning">
							<td width="8"></td>
							<td width="60">Prompts</td>
							<td valign="top">
								{me.state.c_section.pro.map( function(m) {
									return me.recField(m);	
								})}
							</td>
						</tr>						
						<tr className="bg-success">
							<td width="8"></td>
							<td width="60">Answer</td>
							<td valign="top">
								{me.recField(me.state.c_section.ans)}	
							</td>
						</tr>
						<tr className="bg-success">
							<td width="8"></td>
							<td width="60"></td>
							<td valign="top">
								<table  width="100%">
									<tr style={{border:'1px solid #ccc'}}>
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
						<tr className="bg-warning">
							<td width="8"></td>
							<td width="60">Last</td>
							<td valign="top">
								{me.recField(me.state.c_section.done)}
							</td>
						</tr>							
					</table>					
					
					<div className="container-fluid bg-info" style={{padding:'6px', 'text-align':'center'}}>
						<span dangerouslySetInnerHTML=
							{{__html: 'Start: ' + me.props.parent.toHHMMSS(me.props.parent.state.section.s) + 
								' To:' + me.props.parent.toHHMMSS(me.props.parent.state.section.s + me.props.parent.state.section.t)}}
						/>
						<button className="btn btn-default pull-left" onClick={me.props.parent.closePopup.bind(me)}>Abort</button>
						<button className="btn btn-info pull-right" onClick={me.props.parent.acceptSection.bind(me, me.state.c_section)}>Accept</button>
					</div>						
				*/}	
				</span>
				
			)
		}
	});	
	
} catch (err) {
	console.log(err.message);
}
