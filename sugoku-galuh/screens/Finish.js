import React from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import { useDispatch, useSelector } from 'react-redux'
import { resetBoard, setUneditable } from '../store/actions'

const Separator = () => (
    <View style={styles.separator} />
  );

export default function Finish({route, navigation}) {
    const dispatch = useDispatch()
    const select = useSelector
    
    const { name, difficulty, board } = route.params

    function toHome() {
        dispatch(resetBoard())
        navigation.navigate('Home')
    }

    function toBoard() {
        // console.log(board, 'BOARD')
        let finalBoardIndex = []
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                finalBoardIndex.push(`${i}, ${j}`)
            }
        }
        // console.log(finalBoardIndex,'FINAL BOARD')
        dispatch(setUneditable(finalBoardIndex))
        navigation.navigate('Game')
    }

    return (
        <View style={styles.container}>
            <View style={styles.subContainer}>
                <View style={styles.finishTitle}>
                    <Text style={styles.sudokuTitle}>Congratulations, {name}!</Text>
                    <Text style={styles.sudokuText}>You have solved Galuh's Sudoku - {difficulty} Level</Text>
                </View>
                <View style={styles.separator}/>

                <View style={styles.backToBoard}>
                <Text style={styles.sudokuRemark}>Want to Check Out Your Last Board?</Text>
                <Button
                onPress={toBoard}
                title="See Last Board"
                color="darkred"/>
                </View>

                <Separator />

                <View style={styles.backToHome}>
                <Text style={styles.sudokuRemark}>Play Again!</Text>
                <Button
                onPress={toHome}
                title="Start a New Game"
                color="green"/>   
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    separator: {
        marginVertical: 7,
        borderBottomColor: 'lightgrey',
        borderBottomWidth: StyleSheet.hairlineWidth,
      },   
    container: {
      flex: 1,
      backgroundColor: 'darkblue',
      alignItems: 'center',
      justifyContent: 'center',
    },
    subContainer: {
        flex: 1,
        backgroundColor: 'darkblue',
        justifyContent: 'center',
    },
    finishTitle: {
        backgroundColor: 'darkblue',
        alignItems: 'center',
        justifyContent: 'center',
    },
    backToBoard: {
        marginTop: 20,
        backgroundColor: 'darkblue',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    backToHome: {
        marginTop: 20,
        backgroundColor: 'darkblue',
        alignItems: 'center',
        justifyContent: 'center',
    },
    sudokuTitle: {
        marginBottom: 20,
        fontWeight: '900',
        fontSize: 20,
        color: 'greenyellow'
    },  
    sudokuText: {
        marginBottom: 10,
        fontWeight: 'bold',
        color: 'white'
    },
    sudokuRemark: {
        marginBottom: 5,
        fontStyle: 'italic',
        color: 'white'
    }, 
});