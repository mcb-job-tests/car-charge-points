import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
/*import Paper from 'material-ui/Paper';*/

export default class LocationFilter extends Component {

    constructor( props ) {
        super( props );
        this.state = {
            value: this.props.value,
            connectorTypes: this.props.connectorTypes
        }
    }

    componentWillReceiveProps( nextProps ){
        this.setState({
            connectorTypes: nextProps.connectorTypes,
        });
        this.setState({
            value: nextProps.value,
        });
    }

    handleChange(event, index, value){
        /*this.setState({ value: value });*/
        this.props.handleOnChange(value);
    }

    render() {
        let connectorTypes = this.state.connectorTypes;
        return(
            <DropDownMenu
                value={ this.state.value }
                onChange={ this.handleChange.bind( this ) }
                openImmediately={ false }>
                {
                    connectorTypes.map( (connectorType, i) => (
                        <MenuItem key={ i } value={ i } primaryText={ connectorType }/>
                    ))
                }
            </DropDownMenu>
        );
    };

}

LocationFilter.contextTypes = {
    muiTheme: PropTypes.object.isRequired,
};

LocationFilter.propTypes = {
    connectorTypes: PropTypes.array.isRequired,
    value: PropTypes.number.isRequired,
    handleOnChange: PropTypes.func.isRequired,
};