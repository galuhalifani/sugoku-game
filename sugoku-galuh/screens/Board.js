import React, {useEffect, useState} from 'react';
import { ActivityIndicator, StyleSheet, Text, View, TextInput, ScrollView, Button, Alert, Animated, Modal, Pressable } from 'react-native';
import { useDispatch, useSelector } from 'react-redux'
import { fetchBoard, validateBoard, solveBoard, resetBoard, setFinished, setLeaderboard } from '../store/actions'
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';

const Separator = () => (
  <View style={styles.separator} />
);

export default function Board({route, navigation}) {
    const { name, difficulty } = route.params
    const countdown = +route.params.countdown

    const dispatch = useDispatch()
    const select = useSelector
    const [modalVisible, setModalVisible] = useState(false);
    const board = select(state => state.board)
    const loadingBoard = select(state => state.loadingBoard)
    const loadingValidate = select(state => state.loadingValidate)
    const autoSolvedBoard = select(state => state.autoSolvedBoard)
    const boardFetch = select(state => state.boardFetch)
    const boardStatus = select(state => state.boardStatus)
    const [board2, setBoard2] = useState([])
    const uneditable = select(state => state.uneditable)
    const finished = select(state => state.finished)
    const [isPlaying, setIsPlaying] = useState(true)
    const [timeOut, setTimeOut] = useState(false)
    const [normalTimer, setNormalTimer] = useState(false)
    const [timelapse, setTimeLapse] = useState('')
    const [totalTime, setTotalTime] = useState(0)
    let secondCount = 0;
    let stopWatch;

    // board hooks
    useEffect(() => {
      let mounted = true
      // console.log('useEffect 1')
      if(mounted) {
        if (autoSolvedBoard.length > 0) {
          setBoard2(autoSolvedBoard)        
        } else if (board.length > 0) {
          setBoard2(board)
        } 
      }
      return () => { mounted = false };
    }, [board.length, autoSolvedBoard])

    // go to finish page
    useEffect(() => {
      if (boardStatus === 'solved') {
        setNormalTimer(true)
        clearInterval(stopWatch)
        dispatch(setFinished(true))
        dispatch(setLeaderboard({
          name: name,
          totalTime: totalTime
        }))
        navigation.navigate('Finish', {
          name: name,
          difficulty: difficulty,
          secondCount: secondCount,
          timelapse: timelapse,
          board: board2
        })
      }
    }, [boardStatus])

    // hooks for setInterval timelapse
    useEffect(() => {
      let mounted = true
      if(mounted && (finished === false)) {
        stopWatch = setInterval(displayTime, 1000)
      } else if (finished == true) {
        setNormalTimer(true)
        clearInterval(stopWatch)
      }
      return () => { mounted = false, clearInterval(stopWatch) };
    }, [finished])
  
    // if no countdown, use normal timer
    useEffect(() => {
      if (countdown == 0) {
        setNormalTimer(true)
      }
    }, [countdown])

    // hooks for removeScreen
    useEffect(() => {
        navigation.addListener('beforeRemove', (e) => {
          e.preventDefault();
           Alert.alert("Start a New Game?", "Any Unfinished Progress Will Be Lost", [
             {
               text: "Cancel",
               onPress: () => null,
               style: "cancel"
             },
             { text: "YES", onPress: () => navigation.dispatch(e.data.action) }
           ]);
         })    
   }, [navigation])
 
    function changeBoard(text, r, c) {
      if (text.length > 1) {
        alert('Only single digit allowed. Please input value between 1-9')
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

    function toHome() {
      navigation.navigate('Home')
    }

    // display timer (lapsed time)
    function displayTime() {
      let hours = Math.floor(secondCount/3600);
      let minutes = Math.floor((secondCount % 3600)/60);
      let seconds = Math.floor(secondCount % 60)

      // Display a leading zero if the values are less than ten
      let displayHours = (hours < 10) ? '0' + hours : hours;
      let displayMinutes = (minutes < 10) ? '0' + minutes : minutes;
      let displaySeconds = (seconds < 10) ? '0' + seconds : seconds;

      setTotalTime(secondCount)
      setTimeLapse(displayHours + ':' + displayMinutes + ':' + displaySeconds)

      secondCount++;
    }

    // countdown (different from timer)
    function countDownTimeOut() {
      setNormalTimer(true)
      setTimeOut(true)
      setIsPlaying(false)
      Alert.alert("Time Out!", "Would You Like to Continue With Normal Timer?", [
        {
          text: "Give Up - Back To Home",
          onPress: () => {dispatch(setFinished(true)); navigation.navigate('Home')
          }, 
          style: "cancel"
        },
        { text: "Continue", 
          onPress: () => null
        }
      ]);
    }
    
    // console.log('TOTALTIME', totalTime)

    return (
      <ScrollView>
        <View style={styles.containerView}>
          <Text style={styles.sudokuTitle}>Welcome, {name}!</Text>
          <Text style={styles.sudokuText}>Level: {difficulty}</Text>

          {
            countdown == 0 || finished == true ?
            null
            :
            
            <CountdownCircleTimer
                size={50}
                strokeWidth={5}
                isPlaying={isPlaying}
                duration={countdown}
                colors={[
                  ['#004777', 0.5],
                  ['#F7B801', 0.5],
                  ['#A30000', 0.5],
                ]}
                onComplete={countDownTimeOut}
            >
              {({ remainingTime, animatedColor }) => (
                timeOut
                ?
                <Animated.Text style={{ color: animatedColor, fontSize: 10, textAlign:'center' }}>
                Time Out!
                </Animated.Text>
                :  
                <Animated.Text style={{ color: animatedColor, fontSize: 20 }}>
                {remainingTime}
                </Animated.Text>
              )}
            </CountdownCircleTimer>
           
          }

          {
            normalTimer ?
            <Text style={{marginBottom: 10, fontStyle:'italic'}}>Time elapsed: <Text style={{backgroundColor: 'darkred', color:'white'}}>{timelapse}</Text></Text>
            :
            null
          }

          {
            loadingBoard ?
            <ActivityIndicator size="large" color="#00ff00"/>
            :
            <View style={{marginBottom: 10, marginTop: 10}}>
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
                  onChangeText={(text) => changeBoard(text, indexRow, indexCol)}
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
          <View style={{width: '80%', marginBottom: 10}}>
            {
              loadingValidate ?
              <ActivityIndicator size="large" color="#00ff00"/>
              :
              <View style={{alignItems:'center'}}>
              <Text style={{marginBottom: 10, marginTop: 5}}>Status: <Text style={{color: boardStatus == 'Not Validated' ? 'blue' : boardStatus == 'solved' ? 'darkgreen' : 'red'}}>{boardStatus}</Text></Text>
              </View>            
            }
            
            {
              finished ?
              <Button
              onPress={toHome}
              title="Start New Game"
              color="green"/>   
              :
              <View>
                <Button
                onPress={validate}
                title="Validate"
                color="blue"/>

                <Separator />

              <View style={{flexDirection:'row'}}>
                <View style={{flex:1, marginRight: 3}}>
                <Button
                onPress={solve}
                title="Auto-Solve"
                color="green"/>   
                </View>
  
              <Separator />
                <View style={{flex:1}}>
                <Button
                onPress={restart}
                title="Shuffle Board"
                color="darkred"/> 
                </View>
              </View>

              <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                  Alert.alert("Modal has been closed.");
                  setModalVisible(!modalVisible);
                }}
              >
                <View style={styles.centeredView}>
                  <View style={styles.modalView}>
                    <Text style={styles.modalText}>1. Enter Name, Difficulty Level, and Countdown Timer Option</Text>
                    <Text style={styles.modalText}>2. If you choose to play without countdown, a normal timer will be shown</Text>
                    <Text style={styles.modalText}>3. To win, make sure no duplicate numbers are shown in each single row, column, and box</Text>
                    <Text style={styles.modalText}>4. Click 'validate' after filling a cell, to validate your answer</Text>
                    <Text style={styles.modalText}>5. Status 'broken' means you've made the wrong move. Auto-solve feature is disabled in this case</Text>
                    <Text style={styles.modalText}>6. Status 'unsolved' means you've made the right move but not finished yet</Text>
                    <Text style={styles.modalText}>7. Status 'solved' means you've solved the sudoku</Text>
                    <Text style={styles.modalText}>8. Click 'auto-solve' to automatically solve the sudoku, and validate to finish the game</Text>
                    <Text style={styles.modalText}>9. If timer runs out before you solve the sudoku, you can either restart the game, or continue without countdown</Text>
                    <Text style={styles.modalText}>10. Your time will still be recorded regardless if you use countdown or not, and will be shown on the leaderboard stats</Text>
        
                    <Pressable
                      style={[styles.button, styles.buttonClose]}
                      onPress={() => setModalVisible(!modalVisible)}
                    >
                      <Text style={styles.textStyle}>Understood</Text>
                    </Pressable>
                  </View>
                </View>
              </Modal>

              <Separator />
              <View style={{justifyContent: 'center', textAlign: 'center', alignItems:'center'}}>
              <Pressable style={[styles.button, styles.buttonDark]} onPress={() => setModalVisible(true)}>
                <Text style={styles.textStyle}>How To Play</Text>
              </Pressable>
              </View>

              </View>
            }
      
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
      marginTop: 15,
      marginBottom: 15,
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
      marginBottom: 5
    },  
    sudokuBoxTrue: {
      color: 'black',
      flexDirection: 'column',
      height: 40,
      width: 35,
      borderColor: 'darkgrey',
      borderWidth: 0.8,
      padding: 2,
      textAlign: 'center'
    },
    sudokuBoxFalse: {
      color: 'black',
      flexDirection: 'column',
      height: 40,
      width: 35,
      borderColor: 'darkslategrey',
      borderWidth: 0.8,
      padding: 2,
      textAlign: 'center',
      backgroundColor: 'lightgrey'
    },
    sudokuBoxThickRightFalse: {
      color: 'black',
      flexDirection: 'column',
      height: 40,
      width: 35,
      borderWidth: 0.8,
      borderColor: 'darkslategrey',
      borderRightColor: 'darkslategrey',
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
      borderWidth: 0.8,
      borderColor: 'darkslategrey',
      borderRightColor: 'darkslategrey',
      borderRightWidth: 4,
      padding: 2,
      textAlign: 'center'
    },
    sudokuBoxThickLeftTrue: {
      color: 'black',
      flexDirection: 'column',
      height: 40,
      width: 35,
      borderWidth: 0.8,
      borderColor: 'darkslategrey',
      borderLeftColor: 'darkslategrey',
      borderLeftWidth: 4,
      padding: 2,
      textAlign: 'center'
    },
    sudokuBoxThickLeftFalse: {
      color: 'black',
      flexDirection: 'column',
      height: 40,
      width: 35,
      borderWidth: 0.8,
      borderColor: 'darkslategrey',
      borderLeftColor: 'darkslategrey',
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
      borderColor: 'darkslategrey'
    },
    sudokuColsThickTop: {
      flexDirection: 'row',
      borderTopWidth: 3,
      borderColor: 'darkslategrey'
    },
    separator: {
      marginVertical: 8,
      borderBottomColor: '#737373',
      borderBottomWidth: StyleSheet.hairlineWidth,
    },  
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 22
    },
    modalView: {
      margin: 20,
      backgroundColor: "white",
      borderRadius: 20,
      padding: 15,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5
    },
    button: {
      borderRadius: 20,
      padding: 10,
      elevation: 2
    },
    buttonOpen: {
      backgroundColor: "#F194FF",
    },
    buttonDark: {
      backgroundColor: "black",
      color: 'white'
    },
    buttonClose: {
      backgroundColor: "#2196F3",
    },
    textStyle: {
      color: "white",
      fontWeight: "bold",
      textAlign: "center"
    },
    modalText: {
      marginBottom: 15,
      textAlign: "center"
    }
  });