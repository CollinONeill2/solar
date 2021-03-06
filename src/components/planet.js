var React = require('react'),
    Particle = require('./particle'),
    Line = require('./line'),
    PlanetsData = require('../data/planets'),
    dispatcher = require('../core/dispatcher'),
    uuid = require('node-uuid').v4;

var Planet = React.createClass({
    getInitialState: function(){
        var particles = [],
            lines = [],
            data = PlanetsData[this.props.name],
            rotation = this.props.name === 'venus' ? 1 : -1,
            line, particle;

        for(var i = 0; i < (data.lines || []).length; i ++){
            line = data.lines[i];
            lines.push(<Line key={'line:' + i} top={line.top} height={line.height} color={line.color}></Line>);
        }

        for(var i = 0; i < (data.particles || []).length; i ++){
            particle = data.particles[i];
            for(var j = 0; j < data.particles[i].count; j ++){
                particles.push(<Particle key={'particle:' + i + ',' + j} length={data.size} size={data.size * particle.size}
                    speed={particle.speed} color={particle.color} layer={particle.layer} rotation={rotation}/>);
            }
        }

        return {
            id: uuid(),
            lines: lines,
            particles: particles,
            data: data,
            authmosphere: data.authmosphere || null,
            selected: false
        };
    },
    componentDidMount: function(){
        dispatcher.register(function(data){
            if (data.action !== 'planet-select'){ return; }

            this.setState({ selected: this.state.id === data.id && !this.state.selected });
        }.bind(this));
    },
    onPlanetClick: function(){
        dispatcher.dispatch({
            action: 'planet-select',
            id: this.state.id,
            name: this.props.name
        });
    },
    render: function(){
        var boxShadow = [],
            particles = [],
            style, shadowStyle;

        if (this.state.authmosphere){
            boxShadow.push(this.state.authmosphere);
        }

        if (this.state.selected){
            boxShadow.push('0 0 0 5px rgba(255, 255, 255, 0.07)');
            boxShadow.push('0 0 0 10px rgba(255, 255, 255, 0.07)');
            boxShadow.push('0 0 0 15px rgba(255, 255, 255, 0.07)');
            boxShadow.push('0 0 0 20px rgba(255, 255, 255, 0.07)');
        }

        style = {
            width: this.state.data.size + 'px',
            height: this.state.data.size + 'px',
            transform: `translate3D(${this.props.left}px, ${(this.props.boxHeight - this.state.data.size) * 0.5}px, 0)`,
            background: this.state.data.color,
            boxShadow: boxShadow.join(',')
        };

        shadowStyle = {
            marginLeft: parseInt(this.state.data.size) * 0.5 + 'px',
            width: parseInt(this.state.data.size) * 0.5 + 'px',
            height: this.state.data.size + 'px'
        };

        return (<div className="planet" onClick={this.onPlanetClick} style={style}>
                    <div className="shadow" style={shadowStyle}></div>
                    {this.state.particles}
                    {this.state.lines}
                </div>);
    }
});

module.exports = Planet;
