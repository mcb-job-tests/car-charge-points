import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Toggle from 'material-ui/Toggle';
/*import Paper from 'material-ui/Paper';*/
import MapboxDirections from 'mapbox-gl/plugins/src/mapbox-gl-directions/v3.1.1/mapbox-gl-directions';
import MapBox from 'mapbox-gl';
export default class ToggleDirectionInstructions extends Component {

    constructor( props ){
        super( props );
        this.state = {
            labelText: 'Directions On',
            toggled: true,
            directions: this.props.directions,
            map: this.props.map,
        }
    }


    componentWillReceiveProps( nextProps ){
        this.setState({
            directions: nextProps.directions
        });
        this.setState({
           map: nextProps.map
        });
    }

    handleOnToggle(e, isToggled){
        let _this = this;
        let instructionsEl = document.getElementsByClassName("directions-control-instructions");

        console.log(instructionsEl);

        this.setState({
            toggled: isToggled,
            labelText: isToggled ? 'Directions On' : 'Directions Off'
        }, function(){
            instructionsEl[0].hidden = ! _this.state.toggled;

        });
    }

    render() {

        const styles = {
            block: {
                maxWidth: 250,
            },
            toggle: {
                marginBottom: 4,
                fontSize: "0.8em"
            },
            thumbOff: {
                backgroundColor: '#ffcccc',
            },
            trackOff: {
                backgroundColor: '#ff9d9d',
            },
            thumbSwitched: {
                backgroundColor: 'red',
            },
            trackSwitched: {
                backgroundColor: '#ff9d9d',
            },
            labelStyle: {
                color: 'red',
            },
        };

        return (
            <Toggle
                label={ this.state.labelText }
                labelPosition={'left'}
                style={styles.toggle}
                toggled={ this.state.toggled }
                onToggle={ this.handleOnToggle.bind( this ) }
            />
        );
    }
}

ToggleDirectionInstructions.contextTypes = {
    muiTheme: PropTypes.object.isRequired,
};

ToggleDirectionInstructions.propTypes = {
    directions: PropTypes.object.isRequired,
    map: PropTypes.object.isRequired,
};