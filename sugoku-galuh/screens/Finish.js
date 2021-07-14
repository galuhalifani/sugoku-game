import React, { useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Button, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux'
import { resetBoard, setUneditable, setLeaderboard } from '../store/actions'
import { Table, Row, Rows } from 'react-native-table-component';

const Separator = () => (
    <View style={styles.separator} />
  );

export default function Finish({route, navigation}) {
    const dispatch = useDispatch()
    const select = useSelector
    
    const { name, difficulty, board, secondCount, timelapse, totalTime } = route.params
    const leaderboard = select(state => state.leaderboard)
    const sortedLeaderboard = leaderboard.sort(function(a, b){return a[1]-b[1]});
    let leaderBoardHeader = ['Top Players Rank', 'Time (in Seconds)']

    useEffect(() => {
        dispatch(setLeaderboard({
            name: name,
            totalTime: totalTime
        }))
    }, [])

    function toHome() {
        dispatch(resetBoard())
        navigation.navigate('Home')
    }

    function toBoard() {
        let finalBoardIndex = []
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                finalBoardIndex.push(`${i}, ${j}`)
            }
        }
        dispatch(setUneditable(finalBoardIndex))
        navigation.navigate('Game')
    }

    return (
        <View style={styles.container}>
            <View style={styles.subContainer}>
                <View style={styles.finishTitle}>
                    <Text style={styles.sudokuTitle}>Congratulations, {name}!</Text>
                    <Text style={styles.sudokuText}>You have solved Galuh's Sudoku - {difficulty} Level</Text>
                    <Text style={styles.sudokuText}>Your time is {timelapse}</Text>
                </View>

                <View style={styles.separator}/>
                <View style={{minHeight: 100, maxHeight: 225}}>
                    <ScrollView>
                        <View style={styles.leaderboard}>
                            <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
                                <Row data={leaderBoardHeader} style={styles.head} textStyle={styles.textHead}/>
                                <Rows data={sortedLeaderboard} textStyle={styles.textData}/>
                            </Table>
                        </View>
                    </ScrollView>
                </View>

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
    leaderboard: {
        flex: 1,
        flexGrow: 1
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
    head: { height: 40, backgroundColor: '#f1f8ff'},
    textHead: { margin: 6 },
    textData: { margin: 6, color: 'white' }
});