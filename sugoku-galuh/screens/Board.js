import React, {useEffect, useState} from 'react';
import { ActivityIndicator, StyleSheet, Text, View, TextInput, ScrollView, Button } from 'react-native';
import { useDispatch, useSelector } from 'react-redux'
import { fetchBoard, validateBoard, solveBoard, resetBoard } from '../store/actions'

const Separator = () => (
  <View style={styles.separator} />
);

export default function Board({route, navigation}) {
    const { name, difficulty } = route.params

    const dispatch = useDispatch()
    const select = useSelector
    const board = select(state => state.board)
    const loadingBoard = select(state => state.loadingBoard)
    const loadingValidate = select(state => state.loadingValidate)
    const solvedBoard = select(state => state.solvedBoard)
    const boardFetch = select(state => state.boardFetch)
    const boardStatus = select(state => state.boardStatus)
    const [board2, setBoard2] = useState([])
    const uneditable = select(state => state.uneditable)
  
    useEffect(() => {
      console.log('useEffect')
      if (solvedBoard.length > 0) {
        setBoard2(solvedBoard)        
      } else if (board.length > 0) {
        setBoard2(board)
      } 
      
        if (boardStatus === 'solved') {
        console.log('STATUS SOLVED')
        navigation.navigate('Finish', {
          name: name,
          difficulty: difficulty,
          board: board2
        })
      }
    }, [board.length, solvedBoard, boardStatus])
  
    function changedBoard(text, r, c) {
      if (text.length > 1) {
        alert('You can only input 1 digit for each box')
      } else {
        let newBoard = [...board2]
        // console.log('ROW', r, 'COL', c, 'VALUE', text)
        for (let row = 0; row < newBoard.length; row++) {
          for (let col = 0; col < newBoard[row].length; col++) {
            if (row == r && col == c) {
              // console.log('CONDITIONAL OK')
              newBoard[row][col] = +text
              setBoard2(newBoard)
            }
          }
        }        
      }
    }

    function validate() {
      dispatch(validateBoard(board2))
      if (boardStatus === 'solved') {
        console.log('STATUS SOLVED')
        navigation.navigate('Finish', {
          name: name,
          difficulty: difficulty,
          board: board2
        })
      }
    }

    function solve() {
      if (boardStatus == 'broken') {
        alert('Can not auto-solve: board status is "broken". Reset your last move and re-validate.')
      } else {
        dispatch(solveBoard(board2))
      }
    }

    function restart() {
      dispatch(resetBoard())
      dispatch(fetchBoard(difficulty))
    }
  
    return (
      <ScrollView>
        <View style={styles.containerView}>
          <Text style={styles.sudokuTitle}>Welcome, {name}!</Text>
          <Text style={styles.sudokuText}>Level: {difficulty}</Text>

          {
            loadingBoard ?
            <ActivityIndicator size="large" color="#00ff00"/>
            :
            <View style={{marginBottom: 10}}>
            {/* row */}
            { board2.map((row, indexRow) => (
              <View 
              style={indexRow === 2 || indexRow === 5 || indexRow === 8 ? styles.sudokuColsThickBottom : indexRow === 0 ? styles.sudokuColsThickTop : styles.sudokuCols} 
              key={indexRow}>
                  {/* column */}
                  { row.map((col, indexCol) => (
                  <TextInput key={`${indexRow}, ${indexCol}`} 
                  editable={uneditable.includes(`${indexRow}, ${indexCol}`) ? false : true}
                  style={
                    uneditable.includes(`${indexRow}, ${indexCol}`) && indexCol === 0 
                    ? styles.sudokuBoxThickLeftFalse 
                    : uneditable.includes(`${indexRow}, ${indexCol}`) && (indexCol === 2 || indexCol === 5 || indexCol === 8)
                    ? styles.sudokuBoxThickRightFalse 
                    : uneditable.includes(`${indexRow}, ${indexCol}`)
                    ? styles.sudokuBoxFalse
                    : indexCol === 0
                    ? styles.sudokuBoxThickLeftTrue
                    : indexCol === 2 || indexCol === 5 || indexCol === 8
                    ? styles.sudokuBoxThickRightTrue
                    : styles.sudokuBoxTrue
                  } 
                  // style={indexCol === 0 ? styles.sudokuBoxThickLeft : indexCol === 2 || indexCol === 5 || indexCol === 8 ? styles.sudokuBoxThickRight : styles.sudokuBox} 
                  onChangeText={(text) => changedBoard(text, indexRow, indexCol)}
                  keyboardType = 'numeric'
                  value={col === 0 ? '' : `${col}`}>
                  </TextInput>
                  ))}
              </View>
            ))}
            </View>
          }
          
        {
        boardFetch ?
        <View style={{width: '70%', marginBottom: 10}}>
          {
            loadingValidate ?
            <ActivityIndicator size="large" color="#00ff00"/>
            :
            <View style={{alignItems:'center'}}>
            <Text style={{marginBottom: 10, marginTop: 5}}>Status: <Text style={{color: boardStatus == 'Not Validated' ? 'blue' : boardStatus == 'solved' ? 'darkgreen' : 'red'}}>{boardStatus}</Text></Text>
            </View>            
          }

          <Button
          onPress={validate}
          title="Validate"
          color="blue"/>

          <Separator />

          <Button
          onPress={solve}
          title="Auto-Solve"
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
    true: {
      color: 'black',
      flexDirection: 'column',
      height: 40,
      width: 35,
      borderWidth: 1,
      padding: 2,
      textAlign: 'center'
    },
    false: {
      color: 'black',
      flexDirection: 'column',
      height: 40,
      width: 35,
      borderWidth: 1,
      padding: 2,
      textAlign: 'center',
      backgroundColor: 'lightgrey'
    },
    sudokuText: {
      marginBottom: 20
    },  
    sudokuBoxTrue: {
      color: 'black',
      flexDirection: 'column',
      height: 40,
      width: 35,
      borderWidth: 1,
      padding: 2,
      textAlign: 'center'
    },
    sudokuBoxFalse: {
      color: 'black',
      flexDirection: 'column',
      height: 40,
      width: 35,
      borderWidth: 1,
      padding: 2,
      textAlign: 'center',
      backgroundColor: 'lightgrey'
    },
    sudokuBoxThickRightFalse: {
      color: 'black',
      flexDirection: 'column',
      height: 40,
      width: 35,
      borderWidth: 1,
      borderRightWidth: 4,
      padding: 2,
      textAlign: 'center',
      backgroundColor: 'lightgrey'
    },
    sudokuBoxThickRightTrue: {
      color: 'black',
      flexDirection: 'column',
      height: 40,
      width: 35,
      borderWidth: 1,
      borderRightWidth: 4,
      padding: 2,
      textAlign: 'center'
    },
    sudokuBoxThickLeftTrue: {
      color: 'black',
      flexDirection: 'column',
      height: 40,
      width: 35,
      borderWidth: 1,
      borderLeftWidth: 4,
      padding: 2,
      textAlign: 'center'
    },
    sudokuBoxThickLeftFalse: {
      color: 'black',
      flexDirection: 'column',
      height: 40,
      width: 35,
      borderWidth: 1,
      borderLeftWidth: 4,
      padding: 2,
      textAlign: 'center',
      backgroundColor: 'lightgrey'
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
    overlay: {
      flex: 1,
      width: '100%', /* Full width (cover the whole page) */
      height: '100%', /* Full height (cover the whole page) */
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      // backgroundColor: rgba(106, 160, 221, 0.116), /* Black background with opacity */
      zIndex: 2, /* Specify a stack order in case you're using a different order for other elements */
      // cursor: pointer /* Add a pointer on hover */
    }  
  });