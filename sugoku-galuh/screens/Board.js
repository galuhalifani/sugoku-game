import React, {useEffect, useState} from 'react';
import { ActivityIndicator, StyleSheet, Text, View, TextInput, ScrollView, Button, Alert, Animated } from 'react-native';
import { useDispatch, useSelector } from 'react-redux'
import { fetchBoard, validateBoard, solveBoard, resetBoard, setFinished } from '../store/actions'
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';

const Separator = () => (
  <View style={styles.separator} />
);

export default function Board({route, navigation}) {
    const { name, difficulty } = route.params
    const countdown = +route.params.countdown

    const dispatch = useDispatch()
    const select = useSelector
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
    let secondCount = 0;
    let stopWatch;
    const [timelapse, setTimeLapse] = useState('')

    useEffect(() => {
      let mounted = true
      console.log('useEffect 1')
      if(mounted) {
        if (autoSolvedBoard.length > 0) {
          setBoard2(autoSolvedBoard)        
        } else if (board.length > 0) {
          setBoard2(board)
        } 
        if (boardStatus === 'solved') {
          clearInterval(stopWatch)
          dispatch(setFinished(true))
          navigation.navigate('Finish', {
            name: name,
            difficulty: difficulty,
            board: board2
          })
        }
      }
      return () => { mounted = false };
    }, [board.length, autoSolvedBoard, boardStatus])

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
  
    useEffect(() => {
      if (countdown == 0) {
        setNormalTimer(true)
      }
    }, [countdown])

    // hooks for removeScreen
    useEffect(() => {
        navigation.addListener('beforeRemove', (e) => {
          e.preventDefault();
           Alert.alert("Start a New Game?", "Your last game will not be saved", [
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
        setNormalTimer(true)
        clearInterval(stopWatch)
        dispatch(setFinished(true))
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

      secondCount++;

      setTimeLapse(displayHours + ':' + displayMinutes + ':' + displaySeconds)
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
                <Animated.Text style={{ color: animatedColor, fontSize: 10 }}>
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
            
            <Button
            onPress={validate}
            title="Validate"
            color="blue"/>

            <Separator />

            {
              finished ?
              <Button
              onPress={toHome}
              title="Start New Game"
              color="green"/>   
              :
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
                <Separator />
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
      borderWidth: 1,
      padding: 2,
      textAlign: 'center'
    },
    sudokuBoxFalse: {
      color: 'black',
      flexDirection: 'column',
      height: 40,
      width: 35,
      borderColor: 'darkgrey',
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
      borderColor: 'darkgrey',
      borderRightColor: 'black',
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
      borderColor: 'darkgrey',
      borderRightColor: 'black',
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
      borderColor: 'darkgrey',
      borderLeftColor: 'black',
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
      borderColor: 'darkgrey',
      borderLeftColor: 'black',
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