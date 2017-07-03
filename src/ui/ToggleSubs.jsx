import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Toggle from 'material-ui/Toggle';
/*import Paper from 'material-ui/Paper';*/

export default class ToggleSubs extends Component {

    constructor( props ){
        super( props );
        this.state = {
            labelText: '',
            toggled: false,
        }
    }

    componentWillReceiveProps( nextProps ){
        this.setState({
            labelText: nextProps.toggled ? 'Excl. Subs' : 'Incl. Subs'
        })
    }

    handleOnToggle(e, isToggled){
        this.setState({toggled: isToggled})
        this.props.handleOnToggled(isToggled);
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

ToggleSubs.contextTypes = {
    muiTheme: PropTypes.object.isRequired,
};

ToggleSubs.propTypes = {
    handleOnToggled: PropTypes.func.isRequired,
};