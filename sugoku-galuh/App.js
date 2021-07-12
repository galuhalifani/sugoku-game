import { StatusBar } from 'expo-status-bar';
import React, {useEffect} from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView } from 'react-native';
import { Provider } from 'react-redux'
import store from "./store";
import { fetchBoard } from './store/actions'
import Board from './components/Board.js'

export default function App() {
  return (
    <Provider store={store}>
      <Board/>
    </Provider>
  );
}