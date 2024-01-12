import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LocationDataManager from './views/LocationDataManager'; // Your LoginPage component
// import ContentView from './ContentView'; // Another screen in your app

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="LocationDataManager" component={LocationDataManager} />
        {/* <Stack.Screen name="ContentView" component={ContentView} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
