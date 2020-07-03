import React from 'react';
import MapViewDirections from 'react-native-maps-directions';

const Directions = ({destination, origin, onReady}) => (
  <MapViewDirections
    destination={destination}
    origin={origin}
    onReady={onReady}
    apikey="AIzaSyA7yxNyUBem9aPttmpQO255NsUbycVDfQE"
    strokeWidth={3}
    strokeColor="#222"
  />
);

export default Directions;
