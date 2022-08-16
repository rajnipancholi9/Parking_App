import React from 'react';
import {StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from './Components/Home';
import Parking from './Components/Parking';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <StatusBar backgroundColor="#000000" barStyle="light-content" />

      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={Home}
          options={{headerStyle: {backgroundColor: '#b0c4de'}}}
        />
        <Stack.Screen
          name="Parking"
          component={Parking}
          options={{headerStyle: {backgroundColor: '#b0c4de'}}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
