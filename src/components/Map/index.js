import React, {useEffect, useState, useCallback, useRef} from 'react';
import MapView, {Marker} from 'react-native-maps';
import RNLocation from 'react-native-location';
import {View, Alert, Image} from 'react-native';
import Geocoder from 'react-native-geocoding';

import Search from '../Search';
import Directions from '../Directions';
import Details from '../Details';
import {getPixelSize} from '../../utils';

import {
  LocationBoxDestination,
  LocationBoxOrigin,
  LocationText,
  LocationTimeBox,
  LocationTimeText,
  LocationTimeTextSmall,
  Back,
} from './styles';

import markerImage from '../../assets/marker.png';
import backImage from '../../assets/back.png';

Geocoder.init('AIzaSyA7yxNyUBem9aPttmpQO255NsUbycVDfQE');

const Map = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [origin, setOrigin] = useState([0, 0]);
  const [destination, setDestination] = useState([0, 0]);
  const [showRoute, setShowRoute] = useState(false);
  const [title, setTitle] = useState();
  const [duration, setDuration] = useState(null);
  const [location, setLocation] = useState(null);

  const mapView = useRef(null);

  async function loadPosition() {
    setIsLoading(true);

    await RNLocation.requestPermission({
      ios: 'whenInUse',
      android: {
        detail: 'coarse',
      },
    }).then(granted => {
      if (!granted) {
        Alert.alert('Não foi permitido o uso da localização');
      }
    });

    const currentOrigin = await RNLocation.getLatestLocation({
      timeout: 2000,
    });
    const {latitude, longitude} = currentOrigin;
    const response = await Geocoder.from({latitude, longitude});
    const address = response.results[0].formatted_address;
    const currentlocation = address.substring(0, address.indexOf(', '));

    setOrigin([latitude, longitude]);
    setLocation(currentlocation);

    setIsLoading(false);
  }

  const handleLocationSelected = useCallback((data, {geometry}) => {
    const {
      location: {lat: latitude, lng: longitude},
    } = geometry;

    const currentDestination = [latitude, longitude];
    const titleDestination = data.structured_formatting.main_text;
    setTitle(titleDestination);
    setDestination(currentDestination);
    setShowRoute(true);
  }, []);

  const handleBack = useCallback(() => {
    setShowRoute(false);
  }, []);

  useEffect(() => {
    loadPosition();
  }, []);

  return (
    <View style={{flex: 1}}>
      {!isLoading && (
        <>
          <MapView
            style={{flex: 1}}
            initialRegion={{
              latitude: origin[0],
              longitude: origin[1],
              latitudeDelta: 0.0143,
              longitudeDelta: 0.0134,
            }}
            showsUserLocation
            loadingEnabled
            ref={mapView}>
            {showRoute && (
              <>
                <Directions
                  origin={{
                    latitude: origin[0],
                    longitude: origin[1],
                  }}
                  destination={{
                    latitude: destination[0],
                    longitude: destination[1],
                  }}
                  onReady={result => {
                    setDuration(Math.round(result.duration));
                    mapView.current.fitToCoordinates(result.coordinates, {
                      edgePadding: {
                        right: getPixelSize(50),
                        left: getPixelSize(50),
                        top: getPixelSize(50),
                        bottom: getPixelSize(350),
                      },
                    });
                  }}
                />
                <Marker
                  coordinate={{
                    latitude: destination[0],
                    longitude: destination[1],
                  }}
                  anchor={{x: 0, y: 0}}
                  image={markerImage}>
                  <LocationBoxDestination>
                    <LocationText>{title}</LocationText>
                  </LocationBoxDestination>
                </Marker>
                <Marker
                  coordinate={{
                    latitude: origin[0],
                    longitude: origin[1],
                  }}
                  anchor={{x: 0, y: 0}}>
                  <LocationBoxOrigin>
                    <LocationTimeBox>
                      <LocationTimeText>{duration}</LocationTimeText>
                      <LocationTimeTextSmall>MIN</LocationTimeTextSmall>
                    </LocationTimeBox>
                    <LocationText>{location}</LocationText>
                  </LocationBoxOrigin>
                </Marker>
              </>
            )}
          </MapView>
          {showRoute ? (
            <>
              <Back onPress={handleBack}>
                <Image source={backImage} />
              </Back>
              <Details />
            </>
          ) : (
            <Search onLocationSelected={handleLocationSelected} />
          )}
        </>
      )}
    </View>
  );
};

export default Map;
