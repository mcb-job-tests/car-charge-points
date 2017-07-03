import React, { Component } from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';
import './App.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import 'mapbox-gl-directions/src/mapbox-gl-directions.css';
import chargeDevices from './charge-devices.json';
import MapBox from 'mapbox-gl';
import MapboxDirections from 'mapbox-gl/plugins/src/mapbox-gl-directions/v3.1.1/mapbox-gl-directions';
import Axios from 'axios';
import ToggleDirectionInstructions from './ui/ToggleDirectionInstructions.jsx';
import ToggleSubs from './ui/ToggleSubs.jsx';
import DeviceDialog from './ui/DeviceDialog.jsx';
import LocationFilter from './ui/LocationFilter.jsx';
import CentreCoordinator from './ui/CentreCoordinator.jsx';
import Paper from 'material-ui/Paper';

import HashMap from 'hashmap';

injectTapEventPlugin();

class App extends Component {

    constructor( props ){
        super( props );
        this.connectorTypeMap = new HashMap();
        MapBox.accessToken = 'pk.eyJ1IjoibWliMDAwMzgiLCJhIjoiY2ozeGtuOGM1MDAxZDM4b2RpNW5jbzRrbyJ9.PnNL7EKTum0RWyNgQ_zEkg';

        let map = new MapBox.Map({
            container: 'map-root',
            style: 'mapbox://styles/mib00038/cj3xn8wav159i2rn2e2ruader',
            center: [-2.5, 53.5],
            zoom: 5
        });

        map.addControl(new MapBox.FullscreenControl(), 'top-right');
        map.addControl(new MapBox.NavigationControl(), 'top-right');

        let directions = new MapboxDirections({
            accessToken: MapBox.accessToken,
            unit: 'metric',
            profile: 'driving-traffic',
            interactive: false,
            controls: {
                inputs: true,
                instructions: true,
            }
        });

        map.addControl(directions, 'top-left');

        this.state = {
            chargeDevices : chargeDevices.ChargeDevice,
            connectorTypes: [],
            connectorTypeFilterValue: 0,
            subs: false,
            open: false,
            map: map,
            centreLocation:{
                latitude: 53.5,
                longitude: -2.5,
            },
            directions: directions,
            mapCentred : true,
            deviceDetails:{
            },
        };
    }


    handleOpenDeviceDialog(){
        this.setState({ open: true });
    };

    handleCloseDeviceDialog(){
        this.setState({
            open: false,
            deviceDetails: {},
        });
    };

    componentDidMount(){
        let apiUrl = "https://api.mapbox.com/directions/v5/mapbox/driving/";
        let coords = "13.4301,52.5109;13.4265,52.5080;13.4194,52.5072";
        let options = "?radiuses=40;;100&geometries=polyline";
        let accessToken = "&access_token=" + MapBox.accessToken;

        let _this = this;
        this.serverRequest =
            Axios(apiUrl + coords + options + accessToken)
                .then( ( result ) => {
                    _this.setState({
                        result: result
                    });
                });


        this.populateConnectorTypesArray();
        this.addMapGeoPointsLayer();
    };

    populateConnectorTypesArray(){
        let connectorTypes = [];
        this.state.chargeDevices.forEach( ( chargeDevice ) => {
            chargeDevice.Connector.forEach( ( connector ) => {
                if ( connectorTypes.indexOf( connector.ConnectorType ) === -1 ){
                    connectorTypes.push( connector.ConnectorType );
                }
            });
        });
        connectorTypes.sort();
        connectorTypes.unshift("None");


        for( let i = 0; i < connectorTypes.length; i++ ){
            this.connectorTypeMap.set( connectorTypes[ i ], i  );
        }
        this.setState({ connectorTypes: connectorTypes });
    }

    addGeoJsonLayers(){
        let allFeatures = [];
        let nonSubFeatures = [];

        this.populateFeatureArrays( allFeatures, nonSubFeatures );

        this.state.map.addLayer({
            "id": "points-all",
            "type": "symbol",
            "source": {
                "type": "geojson",
                "data": {
                    "type": "FeatureCollection",
                    "features": allFeatures,
                }
            },
            "layout": {
                "visibility": 'visible',
                "icon-image": "{icon}-15",
                "icon-allow-overlap": true,
                "text-field": "{title}",
                "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
                "text-offset": [0, 0.6],
                "text-anchor": "top"
            }
        });

        this.state.map.addLayer({
            "id": "points-nonSub",
            "type": "symbol",
            "source": {
                "type": "geojson",
                "data": {
                    "type": "FeatureCollection",
                    "features": nonSubFeatures,
                }
            },
            "layout": {
                "visibility": 'none',
                "icon-image": "{icon}-15",
                "icon-allow-overlap": true,
                "text-field": "{title}",
                "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
                "text-offset": [0, 0.6],
                "text-anchor": "top"
            },
        });
    };

    getConnectorTypes(connectorArray){
        let connectorTypes = [];
        let _this = this;
        connectorArray.forEach(function(connector){
            connectorTypes.push( _this.connectorTypeMap.get( connector.ConnectorType ) );
            /*console.log( _this.connectorTypeMap.get( connector.ConnectorType ) );*/
        });
        return(connectorTypes);
    }

    populateFeatureArrays( allFeatures, nonSubFeatures ){
        let _this = this;
        let filterValue = this.state.connectorTypeFilterValue;
        this.state.chargeDevices.forEach( ( chargeDevice ) => {
            let coOrd = chargeDevice.ChargeDeviceLocation;
            let connectorTypes = _this.getConnectorTypes( chargeDevice.Connector );
            if ( filterValue === 0 || connectorTypes.indexOf( filterValue ) !== -1 ) {
                let feature = {
                    "type": 'Feature',
                    "geometry": {
                        "type": 'Point',
                        "coordinates": [ coOrd.Longitude, coOrd.Latitude ]
                    },
                    "properties": {
                        "title": '',
                        "icon": 'car',
                        "deviceDetails": {
                            name: chargeDevice.ChargeDeviceName,
                            address: chargeDevice.ChargeDeviceLocation.Address,
                            access24Hours: chargeDevice.Accessible24Hours,
                            paymentDetails: chargeDevice.PaymentDetails,
                            connectorTypes: connectorTypes,
                            ChargeDeviceLocation : coOrd,
                        },
                    }
                };
                if (! chargeDevice.SubscriptionRequiredFlag) {
                    nonSubFeatures.push( feature );
                }
                allFeatures.push( feature );
            }
        });
    }

    addMapGeoPointsLayer(){

        this.state.map.on( 'load', () => {

            this.addGeoJsonLayers();
            let _this = this;

            this.state.map.on( 'moveend', () => {
                let lngLat = _this.state.map.getCenter();
                _this.setState({
                    centreLocation:{
                        longitude: parseFloat(lngLat.lng).toFixed(6),
                        latitude: parseFloat(lngLat.lat,).toFixed(6),
                    },
                    mapCentred : true,
                });
            });

            this.state.map.on( 'mouseenter', 'points-all', function() {
                _this.state.map.getCanvas().style.cursor = 'pointer';
            });

            this.state.map.on( 'mouseleave', 'points-all', function() {
                _this.state.map.getCanvas().style.cursor = '';
            });

            this.state.map.on( 'click', 'points-all', function ( mapLayer ) {
                let features = mapLayer.features[ 0 ];
                let deviceDetails = features.properties.deviceDetails;
                let coordinates = features.geometry.coordinates;
                _this.setState({
                    deviceDetails: JSON.parse( deviceDetails ),
/*                    centreLocation:{
                        longitude: coordinates.longitude,
                        latitude: coordinates.latitude,
                    },*/
                });
                _this.handleOpenDeviceDialog();
            });

        });
    }

    validCoOrd( coord ){
        let isValid = false;

        if ( coord.Longitude > -90 && coord.Longitude < 90 ) {
            if (coord.Latitude > -90 && coord.Latitude < 90 ){
                isValid = true;
            }
        }
        return isValid;
    }

    addPopupMarker(coords){
        let monument = coords;

        // create the popup
        let popup = new MapBox.Popup({offset: 50})
            .setText('Construction on the Washington Monument began in 1848.');

        // create DOM element for the marker
        let el = document.createElement('div');
        el.id = 'marker';

        // create the marker
        new MapBox.Marker(el, {offset:[0, 0]})
            .setLngLat(monument)
            .setPopup(popup) // sets a popup on this marker
            .addTo(this.state.map);
    }

    componentWillUnmount() {
        this.serverRequest.abort();
    };

    setLayoutVisabilities(){
        if ( this.state.subs ){
            this.state.map.setLayoutProperty( 'points-all', 'visibility', 'none' );
            this.state.map.setLayoutProperty( 'points-nonSub', 'visibility', 'visible' );
        } else {
            this.state.map.setLayoutProperty( 'points-all', 'visibility', 'visible' );
            this.state.map.setLayoutProperty( 'points-nonSub', 'visibility', 'none' );
        }
    }

    handleOnToggled( isToggled ){

        this.setState({
            subs: isToggled
        }, function(){
            /*let visibility = this.state.map.getLayoutProperty('points-all', 'visibility');*/
            this.setLayoutVisabilities();
        });



    };

    handleLocationFilterChange( connectorValue ){
        this.setState({ connectorTypeFilterValue: connectorValue }, function(){
            let map = this.state.map;

            map.removeLayer('points-all');
            map.removeSource('points-all');

            map.removeLayer('points-nonSub');
            map.removeSource('points-nonSub');

            this.addGeoJsonLayers();
            this.setLayoutVisabilities();
        });
    };

    render() {
        return (
            <div className="App">
                <Paper className="App-header">
                    <div className="flex-container-header" style={{ width: "100%" }}>
                        <div className="col-5" style={{ width: "100%", maxWidth:"200px" }}>
                            <ToggleDirectionInstructions
                                directions={ this.state.directions }
                                map={ this.state.map }
                            />
                        </div>
                        <div className="col-5" style={{ width: "100%", maxWidth:"200px" }}>
                            <ToggleSubs
                                handleOnToggled={ this.handleOnToggled.bind( this ) }
                                toggled={ this.state.subs }
                            />
                        </div>
                    </div>
                    <div className="center-div">
                        <CentreCoordinator
                            map={ this.state.map }
                            centreLocation={ this.state.centreLocation }
                            mapCentred={ this.state.mapCentred }
                        />
                        < LocationFilter
                            connectorTypes={ this.state.connectorTypes }
                            handleOnChange={ this.handleLocationFilterChange.bind( this ) }
                            value={ this.state.connectorTypeFilterValue }
                        />
                    </div>
                    < DeviceDialog
                        deviceDetails={ this.state.deviceDetails }
                        open={ this.state.open }
                        handleClose={ this.handleCloseDeviceDialog.bind( this ) }
                        directions={ this.state.directions }
                    />
                </Paper>
            </div>
        );
    }
}

export default App;
