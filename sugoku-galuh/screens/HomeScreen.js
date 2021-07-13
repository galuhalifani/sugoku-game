import React from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView, Button } from 'react-native';

const Separator = () => (
    <View style={styles.separator} />
  );

export default function App() {
    return (
    <View style={styles.container}>
      <Text style={styles.sudokuTitle}>Welcome to Sugoku Galuh!</Text>
      <Separator />
    </View>
    );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    sudokuTitle: {
        marginBottom: 20
    },  
    separator: {
      marginVertical: 8,
      borderBottomColor: '#737373',
      borderBottomWidth: StyleSheet.hairlineWidth,
    },    
  });