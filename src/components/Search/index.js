import React, {useState} from 'react';
import {Platform} from 'react-native';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';

const Search = ({onLocationSelected}) => {
  const [focused, setFocused] = useState(false);

  return (
    <GooglePlacesAutocomplete
      placeholder="Para onde?"
      placeholderTextColor="#333"
      onPress={onLocationSelected}
      query={{
        key: 'API KEY',
        language: 'pt',
      }}
      textInputProps={{
        onFocus: () => {
          setFocused({focused: true});
        },
        onBlur: () => {
          setFocused({focused: false});
        },
        autoCapitalize: 'none',
        autoCorrect: false,
      }}
      listViewDisplayed={focused}
      fetchDetails
      enablePoweredByContainer={false}
      styles={{
        container: {
          position: 'absolute',
          top: Platform.select({ios: 60, android: 60}),
          width: '100%',
        },
        textInputContainer: {
          flex: 1,
          backgroundColor: 'transparent',
          height: 54,
          marginHorizontal: 20,
          borderTopWidth: 0,
          borderBottomWidth: 0,
        },
        textInput: {
          height: 54,
          margin: 0,
          borderRadius: 0,
          paddingTop: 0,
          paddingBottom: 0,
          paddingLeft: 20,
          paddingRight: 20,
          marginTop: 0,
          marginLeft: 0,
          marginRight: 0,
          elevation: 5,
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowOffset: {x: 0, y: 0},
          fontSize: 18,
        },
        listView: {
          backgroundColor: '#fff',
          marginHorizontal: 20,
          elevation: 5,
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowOffset: {x: 0, y: 0},
          marginTop: 10,
        },
        description: {
          fontSize: 16,
        },
        row: {
          padding: 20,
          height: 58,
        },
      }}
    />
  );
};

export default Search;
