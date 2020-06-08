import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    let value = this.props.squares[i];
    if (this.props.result && this.props.result.slice(1).includes(i)) {
      value = <i>{value}</i>;
    }
    return (
      <Square key={i} value={value} onClick={() => this.props.onClick(i)} />
    );
  }

  render() {
    const board = [];
    for (let i = 0; i < 3; i++) {
      let boardRow = [];
      for (let j = 0; j < 3; j++) {
        boardRow.push(this.renderSquare(i * 3 + j));
      }
      board.push(
        <div className="board-row" key={i}>
          {boardRow}
        </div>
      );
    }
    return <div className="game-board">{board}</div>;
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          pos: [null, null],
        },
      ],
      stepNumber: 0,
      xIsNext: true,
      navOrder: true,
      posOrder: true,
    };
    this.result = null;
  }

  handleClick(i) {
    const history = this.state.history;
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (this.result || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    const row = Math.floor(i / 3);
    const col = i % 3;

    this.setState({
      history: history.concat([
        {
          squares: squares,
          pos: [row, col],
        },
      ]),
      stepNumber: this.state.stepNumber + 1,
      xIsNext: !this.state.xIsNext,
      currentPos: (row, col),
    });
  }

  jumpTo(step) {
    const history = this.state.history.slice(0, step + 1);
    this.setState({
      history: history,
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }

  changePosOrder() {
    this.setState({
      posOrder: !this.state.posOrder,
    });
  }

  stepText() {}

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];

    const histNav = history.map((_current, step) => {
      const desc = step ? "Go to step #" + step : "Go to game start";
      return (
        <li key={step}>
          <button onClick={() => this.jumpTo(step)}>{desc}</button>
        </li>
      );
    });

    const histPos = history.map((current, step) => {
      let item;
      if (step === history.length - 1) {
        item = (
          <li key={step}>
            <b>
              step #{step}: ({current.pos.toString()})
            </b>
          </li>
        );
      } else {
        item = (
          <li key={step}>
            step #{step}: ({current.pos.toString()})
          </li>
        );
      }
      return item;
    });

    let status;
    this.result = calculateWinner(current.squares);
    if (this.result) {
      status = "Winner: " + this.result[0];
    } else if (this.state.stepNumber === 9) {
      status = "Draw";
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="game">
        <Board
          squares={current.squares}
          result={this.result}
          onClick={(i) => this.handleClick(i)}
        />
        <div className="game-info">
          <div className="game-info-col">
            <div className="game-info-row">
              <div>{status}</div>
              <div>
                <button onClick={() => this.changePosOrder()}>
                  {this.state.posOrder ? "Descend" : "Ascend"}
                </button>
              </div>
            </div>
            <div className="game-info-row">
              <div>
                <ol>{histNav}</ol>
              </div>
              <div>
                <ol>{this.state.posOrder ? histPos : histPos.reverse()}</ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

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
      return [squares[a], a, b, c];
    }
  }
  return null;
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));
