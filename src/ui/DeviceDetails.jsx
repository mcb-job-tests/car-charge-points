import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class DeviceDetails extends Component {

    constructor( props ){
        super( props );
        this.state = {
            deviceDetails: this.props.deviceDetails,
        }
    }

    /*.name: device.ChargeDeviceName,
     "address": device.ChargeDeviceLocation.Address,
     "access24Hours" : device.Accessible24Hours,
     "connectorTypes": {},
     "paymentDetails": device.PaymentDetails*/

    componentWillReceiveProps( nextProps ){
        this.setState({
            deviceDetails: nextProps.deviceDetails,
        });
    }

    render() {
        console.log( this.state.deviceDetails );
        return(
            <div>
                <p> Name: { this.state.deviceDetails.name } </p>
                <p> 24H Access: { this.state.deviceDetails.access24Hours.toString() } </p>
                <p> Payment Details: { this.state.deviceDetails.paymentDetails } </p>
            </div>
        );
    };

}

DeviceDetails.contextTypes = {
    muiTheme: PropTypes.object.isRequired,
};

DeviceDetails.propTypes = {
    deviceDetails: PropTypes.object.isRequired,
};