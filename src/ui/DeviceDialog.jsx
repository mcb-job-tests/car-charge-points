import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import DeviceDetails from './DeviceDetails.jsx';
import FlatButton from 'material-ui/FlatButton';

export default class DeviceDialog extends Component {


    constructor( props ){
        super( props );
        this.state = {
            deviceDetails: this.props.deviceDetails,
            open: this.props.open,
            directions: this.props.directions
        }
    }

    componentWillReceiveProps( nextProps ){
        this.setState({
            deviceDetails: nextProps.deviceDetails,
        });
        this.setState({
            open: nextProps.open,
        });
        this.setState({
            directions: nextProps.directions,
        });
    }

    handleSetDestination(){
        let deviceDetails = this.state.deviceDetails;
        let location = deviceDetails.ChargeDeviceLocation;
        this.state.directions.setDestination([location.Longitude, location.Latitude])
        this.props.handleClose();
    }

    render() {
        const actions = [
            <FlatButton
                label="Set Destination"
                primary={true}
                onTouchTap={this.handleSetDestination.bind( this ) }
            />,
            <FlatButton
                label="Cancel"
                primary={true}
                onTouchTap={this.props.handleClose.bind(this)}
            />
        ];
        return(
            <Dialog
                title="Dialog With Actions"
                actions={actions}
                modal={false}
                open={this.state.open}
                onRequestClose={ this.props.handleClose.bind(this) }
            >
                <DeviceDetails
                    deviceDetails={ this.state.deviceDetails }
                />
            </Dialog>
        );
    };
}

DeviceDialog.contextTypes = {
    muiTheme: PropTypes.object.isRequired,
};

DeviceDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    deviceDetails: PropTypes.object.isRequired,
    directions: PropTypes.object.isRequired,
};