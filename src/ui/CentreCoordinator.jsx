import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
/*import Paper from 'material-ui/Paper';*/
import RaisedButton from 'material-ui/RaisedButton';
import IconButton from 'material-ui/IconButton';
import MyLocationIcon from 'material-ui/svg-icons/maps/my-location';
import {cyan500, orange500, purple500} from 'material-ui/styles/colors';

export default class CentreCoordinator extends Component {

    constructor(props) {
        super(props);
        this.state = {
            map: this.props.map,
            longitude: this.props.centreLocation.longitude,
            latitude: this.props.centreLocation.latitude,
            mapCentred: this.props.mapCentred,
        }
    }

    componentWillReceiveProps( nextProps ){
        this.setState({
            map: nextProps.map,
        });
        this.setState({
            longitude: nextProps.centreLocation.longitude,
            latitude: nextProps.centreLocation.latitude,
        });
        this.setState({
            mapCentred: nextProps.mapCentred,
        })
    }

    onHandleButtonClick(e){
        e.preventDefault();

        this.state.map.flyTo({
            center: [
                this.state.longitude,
                this.state.latitude,
            ]
        });
        this.setState({
            mapCentred: true,
        });
    }

    handleLatitudeOnChange(e){
        e.preventDefault();

        let value = e.target.value;

        this.setState({
            latitude: value < -90 ? -90 : value > 90 ? 90 : value,
            mapCentred: false,
        });
    }

    handleLongitudeOnChange(e){
        e.preventDefault();

        let value = e.target.value;

        this.setState({
            longitude: value < -90 ? -90 : value > 90 ? 90 : value,
            mapCentred: false,
        });
    }

    render(){
        const buttonStyle = {
            width: 40,
            height: 40,
        };
        const styles = {
            smallIcon: {
                width: 36,
                height: 36,
            },
            mediumIcon: {
                width: 48,
                height: 48,
            },
            largeIcon: {
                width: 60,
                height: 60,
            },
            small: {
                width: 72,
                height: 72,
                padding: 16,
            },
            medium: {
                width: 96,
                height: 96,
                padding: 24,
            },
            large: {
                width: 120,
                height: 120,
                padding: 30,
            },
        };

        return(
            <div className="fg-wrapper" style={{ width: "100%" }}>
                <TextField
                    className="col-3"
                    style={{ margin: "4px", width:"100px" }}
                    floatingLabelText="Longitude"
                    floatingLabelFixed={true}
                    type="number"
                    onChange={ this.handleLongitudeOnChange.bind( this ) }
                    value={this.state.longitude}
                />
                <TextField
                    className="col-3"
                    style={{ margin: "4px", width:"100px" }}
                    floatingLabelText="Latitude"
                    floatingLabelFixed={true}
                    type="number"
                    onChange={ this.handleLatitudeOnChange.bind( this ) }
                    value={this.state.latitude}
                />
                <IconButton
                    style={{
                            width: 36,
                            height: 36,
                            color: cyan500
                    }}
                    iconStyle={{
                            width: 36,
                            height: 36,
                            color: cyan500
                    }}
                    onTouchTap={ this.onHandleButtonClick.bind( this ) }
                    disabled={ this.state.mapCentred }
                >
                    <MyLocationIcon />
                </IconButton>
            </div>
        )
    }
}

CentreCoordinator.contextTypes = {
    muiTheme: PropTypes.object.isRequired,
};

CentreCoordinator.propTypes = {
    map : PropTypes.object.isRequired,
    centreLocation : PropTypes.object.isRequired,
    mapCentred: PropTypes.bool.isRequired,
};