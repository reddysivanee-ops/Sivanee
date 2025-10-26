import React, { useState, useEffect } from 'react';
import Square from './Square';

function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [isVsComputer, setIsVsComputer] = useState(false);

  const currentPlayer = xIsNext ? 'X' : 'O';
  const playerLabel = isVsComputer ? (xIsNext ? 'Human (X)' : 'Computer (O)') : currentPlayer;

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
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        return squares[a];
      }
    }
    return null;
  }

  const winner = calculateWinner(squares);
  const status = winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
    ? 'Draw!'
    : `Next player: ${playerLabel}`;

  function handleClick(i) {
    if (winner || squares[i] || (isVsComputer && !xIsNext)) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  }

  function renderSquare(i) {
    return (
      <Square value={squares[i]} onClick={() => handleClick(i)} />
    );
  }

  function makeAIMove() {
    const emptyIndices = squares
      .map((square, index) => (square === null ? index : null))
      .filter(index => index !== null);
    if (emptyIndices.length > 0) {
      const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
      const nextSquares = squares.slice();
      nextSquares[randomIndex] = 'O';
      setSquares(nextSquares);
      setXIsNext(true);
    }
  }

  useEffect(() => {
    if (isVsComputer && !xIsNext && !winner && !squares.every(Boolean)) {
      const timer = setTimeout(makeAIMove, 500); // Delay for better UX
      return () => clearTimeout(timer);
    }
  }, [xIsNext, squares, winner, isVsComputer]);

  function resetGame() {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  }

  function setTwoPlayerMode() {
    setIsVsComputer(false);
    resetGame();
  }

  function setVsComputerMode() {
    setIsVsComputer(true);
    resetGame();
  }

  return (
    <div className="board-container">
      <div style={{ marginBottom: '10px' }}>
        <button
          className={`mode-button ${!isVsComputer ? 'active' : ''}`}
          onClick={setTwoPlayerMode}
          style={{ marginRight: '10px' }}
        >
          Two Players
        </button>
        <button
          className={`mode-button ${isVsComputer ? 'active' : ''}`}
          onClick={setVsComputerMode}
        >
          Vs Computer
        </button>
      </div>
      <div className="status">{status}</div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
      <button className="reset-button" onClick={resetGame}>Reset Game</button>
    </div>
  );
}

export default Board;
