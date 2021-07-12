import React, {useEffect} from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux'
import store from "../store";
import { StatusBar } from 'expo-status-bar';
import { fetchBoard } from '../store/actions'

export default function Board() {
    const dispatch = useDispatch()
    const select = useSelector
    const board = select(state => state.board)
  
    useEffect(() => {
      dispatch(fetchBoard())
    }, [])
  
    // console.log('BOARD YG DIFETCH DI APP', board)
  
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.sudokuTitle}>Sugoku Galuh!</Text>
        {/* <Text>{board}</Text> */}
        <View>
        {/* row */}
        { board.map(row => (
          <View style={styles.sudokuCols} key={row}>
            {/* column */}
            { Array.from(Array(9), (e, j) => (
            <TextInput key={j} style={styles.sudokuBox} editable>R{i}C{j}</TextInput>
            ))}
          </View>
        ))}
      </View>
        <StatusBar style="auto" />        
      </ScrollView>
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
    sudokuBox: {
      flexDirection: 'column',
      height: 40,
      width: 35,
      borderWidth: 1,
      padding: 2,
      textAlign: 'center'
    },
    sudokuCols: {
      flexDirection: 'row'
    }
  });