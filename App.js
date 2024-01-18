import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { getFirestore } from "firebase/firestore";

import app from './firebaseConfig';
import LocationDataManager from './views/LocationDataManager';
// import Login from './views/Login';
// import ContentView from './ContentView'; // Another screen in your app

const Stack = createNativeStackNavigator();

function App() {
  const db = getFirestore(app);
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Road Condition Manager">
        <Stack.Screen name="Road Condition Manager" component={() => {
        return <LocationDataManager db={db} />
        }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
