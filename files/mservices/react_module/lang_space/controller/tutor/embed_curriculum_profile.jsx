try {
	var Embed_curriculum_profile =  React.createClass({
		getInitialState: function() {
			var me = this;
			return {curriculum:{} };
		},	
		componentDidMount:function() {
			var me = this;
		},
		componentDidUpdate:function(prePropos, preState) {
			var me = this, c = me.props.parent.state.curriculum;
			if ((me.props.parent.state.curriculum.id) && !me.state.curriculum.id) {
				me.setState({curriculum:{
						id:c.id,
						name:c.name,
						published:c.published
					}
				});
			}
		},
		cancelToSave:function() {
			var me = this;
			me.props.parent.props.router.push('/tutor/my_curriculums');
		},				
		handleChange:function(code, e) {
			var me = this, curriculum = me.state.curriculum;
			curriculum[code] = e.target.value;
			me.setState(curriculum);
		},
		handlePublished:function() {
			var me = this, c = me.state.curriculum;
			if (!c.published) c.published = 1;
			else { c.published = 0; }
			me.setState({curriculum:c}, function(){
				me.submitCurriculum();
			});
			
		},		
		submitCurriculum:function() {
			var me = this, c = me.props.parent.state.curriculum;
			for (var o in me.state.curriculum) c[o] =  me.state.curriculum[o];
			me.props.parent.setState({curriculum:c},
				function() {
					console.log(c);
					me.props.parent.submitCurriculum(c.id, false);
				}
			);
		},
		submitButton:function(){
			var me = this;
			if ( (me.state.curriculum.name) && me.props.parent.state.curriculum.name != me.state.curriculum.name ) { 
				return (<span className="input-group-addon" 
							onClick={me.submitCurriculum.bind(me)}>
							<i className="fa fa-check text-success" aria-hidden="true"></i>
					</span>);
			} else {
				return (<span className="input-group-addon">
						<i className="fa fa-check text-success" style={{color:'transparent'}}></i>
					</span>);		
			}
		},		
		render: function() {
			var me = this;
			return (<div>	
					mother language:{me.props.parent.state.curriculum.mother_lang} = 
					learning language:{me.props.parent.state.curriculum.learning_lang} - 
					training level:{me.props.parent.state.curriculum.level}
					<div style={{'background-color':'lightyellow', 'color':'red', 'padding':'0.5em',
						'display':(!me.state.error)?'none':'', 'border-radius': '0.5em'  
						    }}>{me.state.error}</div>
		
					<div className="form-group input-group">
						<input type="text" className="form-control inpit-white-bg" 
							value={me.state.curriculum.name}
							onChange={this.handleChange.bind(this, 'name')}
							aria-label=""/>					
						{me.submitButton()}
					</div>
					
					<div>
						<table className="table table-condensed" width="100%">
						{ (function () { 
							if (me.props.parent.state.sections.length) return (<thead>
							      <tr>
								<th>Start</th>
								<th>Length</th>
								<th>Text
									<button className="btn btn-warning btn-xs pull-right" 
									onClick={me.props.parent.createSection.bind(me)}>
										<i className="fa fa-plus" aria-hidden="true"></i>
									</button>      
								</th>
							      </tr>
							    </thead>)})()}
						    <tbody>
						{me.props.parent.state.sections.map(function(rec) { return (<tr>
							<td>
								<span dangerouslySetInnerHTML={{__html: me.props.parent.toHHMMSS(rec.data.track.s)}} />    
							</td>
							<td>	    
								<span dangerouslySetInnerHTML={{__html:rec.data.track.t}} /> (s)    
							</td>	    
							<td>
								<button className="btn btn-warning btn-xs pull-right"
									onClick={me.props.parent.editSection.bind(me, rec.section_id)}>
									<i className="fa fa-pencil" aria-hidden="true"></i>	
								</button>
								{rec.data.answer}
							</td>
						      </tr>)})}		    
						    </tbody>
						  </table>
						
						{
						(function () { 
							if (!me.props.parent.state.sections.length) return (
								<button className="btn btn-warning btn_margin3" 
								onClick={me.props.parent.createSection.bind(me)}>
									<i className="fa fa-plus" aria-hidden="true"></i> Create a new section
								</button>)})()
						} 
					</div>	
					
					<div>
						{(!me.state.curriculum.published)?(<button type="button" onClick={me.handlePublished.bind(this)} 
							className="btn btn-success btn_margin3">
							<i className="fa fa-share" aria-hidden="true"></i> Publish</button>):
							(<button type="button" onClick={me.handlePublished.bind(this)} 
							className="btn btn-danger btn_margin3">
							<i className="fa fa-share" aria-hidden="true"></i> Unpublish</button>)
						}						
						
						
						<button type="button" onClick={me.cancelToSave.bind(me)} 
							className="btn btn-warning btn_margin3">Exit edit</button>

						<button type="button" onClick={me.props.parent.deleteCurriculum.bind(me)} 
							className="btn btn-warning btn_margin3">
							<i className="fa fa-trash-o" aria-hidden="true"></i>  Delete Curriculum
						</button>
					</div>					
					
				</div>)
		}
	});	
} catch (err) {
	console.log(err.message);
}
