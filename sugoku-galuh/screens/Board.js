import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView, Button } from 'react-native';
import { useDispatch, useSelector } from 'react-redux'
import { StatusBar } from 'expo-status-bar';
import { fetchBoard, validateBoard, solveBoard, resetBoard } from '../store/actions'

const Separator = () => (
  <View style={styles.separator} />
);

export default function Board({route, navigation}) {
    const { name, difficulty } = route.params

    const dispatch = useDispatch()
    const select = useSelector
    const board = select(state => state.board)
    const solvedBoard = select(state => state.solvedBoard)
    const boardFetch = select(state => state.boardFetch)
    const boardStatus = select(state => state.boardStatus)
    const [board2, setBoard2] = useState([])
    const uneditable = select(state => state.uneditable)
  
    useEffect(() => {
      dispatch(fetchBoard(difficulty))
      if (solvedBoard.length > 0) {
        setBoard2(solvedBoard)        
      } else if (board.length > 0) {
        setBoard2(board)
      }
    }, [board.length, solvedBoard.length])
  
    function changedBoard(text, r, c) {
      // console.log('latest board2', board2)
      let newBoard = [...board2]
      console.log('ROW', r, 'COL', c, 'VALUE', text)
      for (let row = 0; row < newBoard.length; row++) {
        for (let col = 0; col < newBoard[row].length; col++) {
          if (row == r && col == c) {
            console.log('CONDITIONAL OK')
            newBoard[row][col] = +text
            setBoard2(newBoard)
          }
        }
      }
    }

    function validate() {
      dispatch(validateBoard(board2))
    }

    function solve() {
      if (boardStatus == 'broken') {
        alert('Can not auto-solve: board status is "broken". Start a new game or adjust board')
      }
      dispatch(solveBoard(board2))
    }

    function restart() {
      dispatch(resetBoard())
      dispatch(fetchBoard(difficulty))
    }

    // console.log(JSON.stringify(board), 'BOARD')
  
    return (
      <ScrollView>
        <View style={styles.containerView}>
          <Text style={styles.sudokuTitle}>Welcome, {name}!</Text>
          <Text style={styles.sudokuText}>Level: {difficulty}</Text>
          <View>
            {/* row */}
            { board2.map((row, indexRow) => (
              <View 
              style={indexRow === 2 || indexRow === 5 || indexRow === 8 ? styles.sudokuColsThickBottom : indexRow === 0 ? styles.sudokuColsThickTop : styles.sudokuCols} 
              key={indexRow}>
                  {/* column */}
                  { row.map((col, indexCol) => (
                  <TextInput key={`${indexRow}, ${indexCol}`} 
                  editable={uneditable.includes(`${indexRow}, ${indexCol}`) ? false : true}
                  style={indexCol === 0 ? styles.sudokuBoxThickLeft : indexCol === 2 || indexCol === 5 || indexCol === 8 ? styles.sudokuBoxThickRight : styles.sudokuBox} 
                  onChangeText={(text) => changedBoard(text, indexRow, indexCol)}
                  keyboardType = 'numeric'
                  value={col === 0 ? '' : `${col}`}>
                  </TextInput>
                  ))}
              </View>
            ))}
        </View>

        {
        boardFetch ?
        <View style={{width: '70%', marginBottom: 30}}>
          <Separator />

          <View style={{alignItems:'center'}}>
          <Text style={{marginBottom: 10}}>Status: <Text style={{color: boardStatus == 'Not Validated' ? 'blue' : boardStatus == 'solved' ? 'darkgreen' : 'red'}}>{boardStatus}</Text></Text>
          </View>

          <Button
          onPress={validate}
          title="Validate"
          color="blue"/>

          <Separator />

          <Button
          onPress={solve}
          title="Solve"
          color="green"/>   

          <Separator />

          <Button
          onPress={restart}
          title="Shuffle New Board"
          color="darkred"/> 
          <Separator />
     
        </View>
        :
        null
        }      

        {/* <StatusBar style="auto" />   */}
      </View>      
      </ScrollView>
    );
  }

  const styles = StyleSheet.create({
    containerView: {
      flex: 1,
      flexGrow: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    sudokuTitle: {
      marginTop: 30,
      marginBottom: 20,
      fontWeight: 'bold'
    },  
    sudokuText: {
      marginBottom: 20
    },  
    sudokuBox: {
      color: 'black',
      flexDirection: 'column',
      height: 40,
      width: 35,
      borderWidth: 1,
      padding: 2,
      textAlign: 'center'
    },
    sudokuBoxThickRight: {
      color: 'black',
      flexDirection: 'column',
      height: 40,
      width: 35,
      borderWidth: 1,
      borderRightWidth: 4,
      padding: 2,
      textAlign: 'center'
    },
    sudokuBoxThickLeft: {
      color: 'black',
      flexDirection: 'column',
      height: 40,
      width: 35,
      borderWidth: 1,
      borderLeftWidth: 4,
      padding: 2,
      textAlign: 'center'
    },
    sudokuCols: {
      flexDirection: 'row'
    },
    sudokuColsThickBottom: {
      flexDirection: 'row',
      borderBottomWidth: 3,
    },
    sudokuColsThickTop: {
      flexDirection: 'row',
      borderTopWidth: 3,
    },
    separator: {
      marginVertical: 8,
      borderBottomColor: '#737373',
      borderBottomWidth: StyleSheet.hairlineWidth,
    },    
  });