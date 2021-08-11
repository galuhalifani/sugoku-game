import React from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView, Button } from 'react-native';
import { Provider } from 'react-redux'
import store from "./store";
import Board from './screens/Board.js'
import HomeScreen from './screens/HomeScreen.js'
import Finish from './screens/Finish.js'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

export default function App() {
  const Stack = createStackNavigator();

  return (
    <Provider store={store}>
      <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} options={{headerShown: false}} />
        <Stack.Screen name="Game" component={Board} />
        <Stack.Screen name="Finish" component={Finish} options={{headerShown: false}}/>
      </Stack.Navigator>
    </NavigationContainer>
    </Provider>
  );
}