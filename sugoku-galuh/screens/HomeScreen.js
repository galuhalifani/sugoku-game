import React, {useState, useRef, useEffect} from 'react';
import { StyleSheet, Text, View, TextInput, Button, BackHandler, Alert } from 'react-native';
import {Picker} from '@react-native-picker/picker';
import { useDispatch, useSelector } from 'react-redux'
import { fetchBoard, resetBoard, setFinished } from '../store/actions'

const Separator = () => (
    <View style={styles.separator} />
  );

export default function HomeScreen({navigation}) {
    const dispatch = useDispatch()
    const select = useSelector
    const [selectedDifficulty, setSelectedDifficulty] = useState('');
    const [playerName, setPlayerName] = useState('');
    const [countdown, setCountdown] = useState('0');
    const pickerRef = useRef();

    useEffect(() => {
      const homePage = navigation.addListener('focus', () => {
        dispatch(resetBoard())
        dispatch(setFinished(false))  
        setSelectedDifficulty('')
        setCountdown('0')  
      })
      return homePage
    }, [navigation])

    function open() {
      pickerRef.current.focus();
    }

    function close() {
      pickerRef.current.blur();
    }

    function changePlayerName(text) {
      setPlayerName(text)
    }

    function startGame() {
      if (playerName == '') {
        alert('Please enter your name')
      } else if (selectedDifficulty == '') {
        alert('Please select difficulty level')
      } else {
        dispatch(resetBoard())
        dispatch(setFinished(false))
        dispatch(fetchBoard(selectedDifficulty))
        navigation.navigate('Game', {
          name: playerName,
          difficulty: selectedDifficulty,
          countdown: countdown
        })
      }
    }

    return (
    <View style={styles.container}>
      <Text style={styles.sudokuTitle}>Welcome to Sugoku By Galuh!</Text>
      <Separator />
      <View style={styles.formView}>
        <Text style={styles.formTitle}>Enter Name and Level</Text>
        
        <TextInput style={styles.nameForm}
        editable
        onChangeText={(text) => changePlayerName(text)}
        placeholder='Please Enter Your Name'
        placeholderTextColor="lightgrey"
        value={playerName}>
        </TextInput>

        <Picker style={styles.picker}
          ref={pickerRef}
          mode={'dropdown'}
          selectedValue={selectedDifficulty}
          onValueChange={(itemValue) =>
            setSelectedDifficulty(itemValue)
          }>
          <Picker.Item label="Difficulty" value="" enabled={false}/>
          <Picker.Item label="Easy" value="easy" />
          <Picker.Item label="Medium" value="medium" />
          <Picker.Item label="Hard" value="hard" />
          <Picker.Item label="Random" value="random" />
        </Picker>

        <View style={{marginTop: 10}}>
        <Text style={styles.formTitle}>Add a Countdown Timer?</Text>
            <Picker style={styles.pickerCountdown}
            ref={pickerRef}
            selectedValue={countdown}
            onValueChange={(itemValue) =>
              setCountdown(itemValue)
            }>
              <Picker.Item label="Play Without Countdown" value="0"/>
              <Picker.Item label="10 Seconds" value="10" />
              <Picker.Item label="30 Seconds" value="30" />
              <Picker.Item label="1 Minute" value="60" />
              <Picker.Item label="1.5 Minutes" value="90" />
              <Picker.Item label="2 Minutes" value="120" />
              <Picker.Item label="2.5 Minutes" value="150" />
            </Picker>
        </View>
      </View>

      <Separator />

      <Button style={styles.validateButton}
        onPress={startGame}
        title="Start a New Game"
        color="darkgreen">
        </Button>

    </View>
    );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'maroon',
      alignItems: 'center',
      justifyContent: 'center',
    },
    sudokuTitle: {
        marginBottom: 20,
        fontWeight: '900',
        fontSize: 20,
        color: 'yellow'
    },  
    formTitle: {
      color: 'white', 
      fontWeight: 'bold',
      backgroundColor: 'black', 
      padding: 5, 
      borderBottomColor: 'lightgrey', 
      borderBottomWidth: StyleSheet.hairlineWidth, 
      marginBottom: 5, 
      textAlign:'center'
    },
    separator: {
      marginVertical: 7,
      borderBottomColor: 'lightgrey',
      borderBottomWidth: StyleSheet.hairlineWidth,
    },  
    formView: {
      backgroundColor: 'saddlebrown',
      marginTop: 10,
      borderWidth: 1,
      padding: 5,
      // alignItems: 'center',
      width: '80%',
      color: 'white',
      marginBottom: 40
    },  
    nameForm: {
      marginTop: 10,
      marginLeft: 10,
      height: 40,
      width: '80%',
      color: 'white',
      // fontStyle: 'italic',
      marginBottom: 20,
      borderBottomColor: 'lightgrey',
      borderBottomWidth: StyleSheet.hairlineWidth
    },
    picker: {
      // alignItems: 'center',
      width: '50%',
      color: 'white',
      marginBottom: 10,
      borderBottomColor: 'lightgrey',
      borderBottomWidth: StyleSheet.hairlineWidth
    },
    pickerCountdown: {
      // alignItems: 'center',
      width: '50%',
      color: 'white',
      marginBottom: 10,
      marginTop: 10,
      borderBottomColor: 'lightgrey',
      borderBottomWidth: StyleSheet.hairlineWidth
    },
    brightText: {
      color: 'white'
    }
  });