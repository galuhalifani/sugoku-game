import React, {useState, useRef, useEffect} from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView, Button } from 'react-native';
import {Picker} from '@react-native-picker/picker';
import { useDispatch, useSelector } from 'react-redux'
import { StatusBar } from 'expo-status-bar';
import { fetchBoard, validateBoard, solveBoard, resetBoard } from '../store/actions'

const Separator = () => (
    <View style={styles.separator} />
  );

export default function HomeScreen({navigation}) {
    const dispatch = useDispatch()
    const select = useSelector
    const [selectedDifficulty, setSelectedDifficulty] = useState('');
    const [playerName, setPlayerName] = useState('');
    const pickerRef = useRef();

    useEffect(() => {
      console.log('re-render HOME')
      setPlayerName('')
      setSelectedDifficulty('')
    }, [])

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
        dispatch(fetchBoard(selectedDifficulty))
        navigation.navigate('Game', {
          name: playerName,
          difficulty: selectedDifficulty
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
      </View>

      <Separator />

      <Button style={styles.validateButton}
        onPress={startGame}
        title="Start Playing"
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
      marginBottom: 10
    },
    brightText: {
      color: 'white'
    }
  });