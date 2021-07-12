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
  
    console.log('BOARD YG DIFETCH DI APP', JSON.stringify(board))
  
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.sudokuTitle}>Sugoku Galuh!</Text>
        {/* <Text>{board}</Text> */}
        <View>
        {/* row */}
        { board.map((row, indexRow) => (
          <View style={styles.sudokuCols} key={indexRow}>
            {/* column */}
            { row.map((col, indexCol) => (
            <TextInput key={`${indexRow}, ${indexCol}`} style={styles.sudokuBox} editable>{col === 0 ? '' : col}</TextInput>
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