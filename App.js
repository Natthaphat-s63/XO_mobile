import { StyleSheet, Text, View,FlatList,Dimensions,TouchableOpacity,ScrollView } from 'react-native';
import React,{useState} from 'react';


const WIDTH = Dimensions.get('window').width;
const numCol=3;
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

export default function App() {
  const [state,setState]=useState({
    history: [{
      squares: Array(9).fill(null),
    }],
    stepNumber: 0,
    xIsNext: true,
  })
  const data = [{key:'0'},{key:'1'},{key:'2'},{key:'3'},{key:'4'},{key:'5'},
  {key:'6'},{key:'7'},{key:'8'}]


  const handleClick=(i)=> {
    const history = state.history.slice(0, state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = state.xIsNext ? 'X' : 'O';
    setState({
      history: history.concat([{
        squares: squares,
      }]),
      stepNumber: history.length,
      xIsNext: !state.xIsNext,
    });
  }

  const render_item=({item,index})=>{
    const history = state.history.slice(0, state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    var id=parseInt(item.key)
    return(
      <TouchableOpacity
      key={id}
      style={styles.butt}
      onPress={()=>handleClick(id)}
      >
      <Text style={{fontSize:48}}>{squares[id]}</Text> 
      </TouchableOpacity>
    );
  }
  const jumpTo=(step)=> {
    setState({
      ...state,
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

 
  let status="";
  const history = state.history;
  let current = history[state.stepNumber];
  let winner = calculateWinner(current.squares);

  const moves = history.map((step, move) => {
    const desc = move ?
      'Go to move #' + move :
      'Go to game start';
    return (
        <TouchableOpacity 
        key={'move'+move}
         style={styles.move} 
         onPress={() => jumpTo(move)} >
          <Text style={{fontSize:18}}>{desc}</Text>
        </TouchableOpacity>
    );
  });
  if (winner) {
  status = 'Winner: ' + winner;
  } else {
  status = 'Next player: ' + (state.xIsNext ? 'X' : 'O');
  }

  return (
    <View style={styles.container}>
      
      <View>
        <FlatList
          data={data}
          renderItem={render_item}       
          keyExtractor={(item,index)=> index.toString()}
          numColumns={numCol} 
        />
      </View>
      <ScrollView>
      <View style={styles.info}>
          <Text style={{fontSize:32}}>{status}</Text>
          <View >{moves}</View>
      </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop:50,
    flex: 1,
  },
  info:{
    marginTop:20,
    alignItems:'center',
    justifyContent:'center',
  },
  move:{
    margin:20,
    width:200,
    height:50,
    backgroundColor: "#DDDDDD",
    alignItems:'center',
    padding: 10,
  },
  butt: {
    margin:4,
    alignItems:'center',
    justifyContent:'center',
    height:WIDTH/numCol,
    flex:1,
    backgroundColor: "#DDDDDD",
    padding: 10
  },
});
