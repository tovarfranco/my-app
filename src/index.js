import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


function Square(props){
    return (
        <button 
            className={props.isWinner ? "square winner" : "square"}
            onClick={props.onClick} >
            {props.value}
        </button>
    );
}

class Board extends React.Component {

    renderSquare(i) {
        return (
            <Square 
                key={i}
                value={this.props.squares[i]}
                isWinner={this.props.winners.includes(i)}
                onClick={() => this.props.onClick(i)}
            />);
    }
    

    render() {
        let rows = [];
        for(var i = 0; i < 3; i++){
            let squares = [];
            for(var j = 0; j < 3; j++){
            squares.push(this.renderSquare(3*i+j));
            }
            rows.push(<div key={i} className="board-row">{squares}</div>);
        }
        return (
            <div>{rows}</div>
        );
    }
  }
  
class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                lastSquare: null,
                sortOrder: true,
            }],
            stepNumber: 0,
            xIsNext: true,
        };
    }
    
    jumpTo(step) {
        this.setState({
          stepNumber: step,
          xIsNext: (step % 2) === 0,
        });
    }

    toggleSort(){
        this.setState({
            sortOrder: !this.state.sortOrder,
        });
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares).winner || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
                lastSquare: i,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    render() {
        let history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares).winner;
        const moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move :
                'Go to game start';
            return (
                <li key={move}>
                    <button 
                        onClick={() => this.jumpTo(move)}
                        className={current.squares === step.squares ? 'strong' : ''}
                    >{desc} - ({step.lastSquare !== null ? ((step.lastSquare % 3).toString() + ', ' + (Math.floor(step.lastSquare/3).toString())) : 'No moves'})
                    </button>
                    
                </li>
            )
        });

        if (this.state.sortOrder)
        {
            moves.reverse();
        }

        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else if (moves.length === 10) {
            status = 'Draw!'
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }
        return (
            <div>
            <div className="game">
            <div className="game-board">
                <Board 
                    squares={current.squares}
                    winners={calculateWinner(current.squares).winningLine}
                    onClick={(i) => this.handleClick(i)}
                />
            </div>
            </div>
            <div className="game">
            <div className="game-info">
                <div>{status}</div>
                <button
                    onClick={() => this.toggleSort()}
                >Sort</button>
                <ol>{moves}</ol>
            </div>
            </div>
            </div>
        );
    }
  }
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
  

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
        return {winner: squares[a], winningLine: lines[i]};
      }
    }
    return {winner: null, winningLine: []};
  }