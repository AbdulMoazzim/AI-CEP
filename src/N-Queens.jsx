import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Pause, SkipForward, FastForward } from 'lucide-react';

const NQueensVisualizer = () => {
  const [n, setN] = useState(8);
  const [algorithm, setAlgorithm] = useState('csp');
  const [board, setBoard] = useState([]);
  const [solving, setSolving] = useState(false);
  const [message, setMessage] = useState('');
  const [stepCount, setStepCount] = useState(0);
  const [speed, setSpeed] = useState(500);
  const [isPaused, setIsPaused] = useState(false);
  const solverRef = useRef(null);
  const pausedRef = useRef(false);

  useEffect(() => {
    resetBoard();
  }, [n]);

  const resetBoard = () => {
    setBoard(Array.from({ length: n }, () => Array(n).fill(false)));
    setStepCount(0);
    setMessage('Ready to solve');
    setSolving(false);
    setIsPaused(false);
    pausedRef.current = false;
    if (solverRef.current) {
      solverRef.current.stop = true;
    }
  };

  const sleep = (ms) => {
    return new Promise(resolve => {
      const checkPause = () => {
        if (!pausedRef.current && !solverRef.current?.stop) {
          resolve();
        } else if (solverRef.current?.stop) {
          resolve();
        } else {
          setTimeout(checkPause, 50);
        }
      };
      setTimeout(checkPause, ms);
    });
  };

  const updateBoard = async (newBoard, msg) => {
    if (solverRef.current?.stop) return false;
    setBoard(newBoard.map(row => [...row]));
    setMessage(msg);
    setStepCount(prev => prev + 1);
    await sleep(speed);
    return !solverRef.current?.stop;
  };

  // CSP with Constraint Propagation Algorithm (Animated)
  const solveCSPAnimated = async () => {
    let boardState = Array.from({ length: n }, () => Array(n).fill(false));
    let domain = Array.from({ length: n }, () => Array.from({ length: n }, (_, j) => j));

    const propagateConstraints = (rRow, col, currentDomain) => {
      let newDomain = currentDomain.map(d => [...d]);
      
      for (let j = 0; j < n; j++) {
        if (col !== j) {
          newDomain[j] = newDomain[j].filter(x => x !== rRow);
        }
      }
      
      for (let k = 0; k < n; k++) {
        if (col !== k) {
          let diff = Math.abs(col - k);
          newDomain[k] = newDomain[k].filter(
            x => x !== rRow - diff && x !== rRow + diff
          );
        }
      }
      return newDomain;
    };

    const solve = async (col, currentDomain) => {
      if (solverRef.current?.stop) return false;
      if (col === n) {
        await updateBoard(boardState, '✅ Solution found!');
        return true;
      }
      
      for (let row of currentDomain[col]) {
        if (solverRef.current?.stop) return false;
        
        if (!boardState[row][col]) {
          boardState[row][col] = true;
          const cont = await updateBoard(
            boardState, 
            `Placing queen at Row ${row + 1}, Column ${col + 1}`
          );
          if (!cont) return false;

          let savedDomain = currentDomain.map(d => [...d]);
          let newDomain = propagateConstraints(row, col, currentDomain);
          
          if (await solve(col + 1, newDomain)) return true;
          
          boardState[row][col] = false;
          const cont2 = await updateBoard(
            boardState, 
            `Backtracking from Row ${row + 1}, Column ${col + 1}`
          );
          if (!cont2) return false;
          currentDomain = savedDomain;
        }
      }
      return false;
    };

    const result = await solve(0, domain);
    if (!result && !solverRef.current?.stop) {
      setMessage('No solution found.');
    }
  };

  // DFS Backtracking Algorithm (Animated)
  const solveDFSAnimated = async () => {
    const queenPositions = new Array(n).fill(-1);
    let boardState = Array.from({ length: n }, () => Array(n).fill(false));

    const isSafe = (row, col) => {
      for (let i = 0; i < row; i++) {
        if (queenPositions[i] === col) return false;
        if (Math.abs(queenPositions[i] - col) === Math.abs(i - row)) return false;
      }
      return true;
    };

    const dfs = async (row) => {
      if (solverRef.current?.stop) return false;
      
      if (row === n) {
        await updateBoard(boardState, '✅ Solution found!');
        return true;
      }
      
      for (let col = 0; col < n; col++) {
        if (solverRef.current?.stop) return false;
        
        if (isSafe(row, col)) {
          queenPositions[row] = col;
          boardState[row][col] = true;
          
          const cont = await updateBoard(
            boardState, 
            `Trying queen at Row ${row + 1}, Column ${col + 1}`
          );
          if (!cont) return false;

          if (await dfs(row + 1)) return true;
          
          queenPositions[row] = -1;
          boardState[row][col] = false;
          
          const cont2 = await updateBoard(
            boardState, 
            `Backtracking from Row ${row + 1}, Column ${col + 1}`
          );
          if (!cont2) return false;
        }
      }
      return false;
    };

    const result = await dfs(0);
    if (!result && !solverRef.current?.stop) {
      setMessage('No solution found.');
    }
  };

  const handleSolve = async () => {
    solverRef.current = { stop: false };
    setSolving(true);
    setIsPaused(false);
    pausedRef.current = false;
    setStepCount(0);
    setMessage('Starting...');
    
    if (algorithm === 'csp') {
      await solveCSPAnimated();
    } else {
      await solveDFSAnimated();
    }
    
    setSolving(false);
  };

  const handlePause = () => {
    pausedRef.current = !pausedRef.current;
    setIsPaused(!isPaused);
  };

  const handleStop = () => {
    if (solverRef.current) {
      solverRef.current.stop = true;
    }
    setSolving(false);
    setIsPaused(false);
    pausedRef.current = false;
  };

  const cellSize = Math.min(500 / n, 50);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 text-center">
            N-Queens Solver
          </h1>
          <p className="text-gray-600 text-center mb-8">
            Watch algorithms solve the N-Queens problem step by step
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Number of Queens (N)
              </label>
              <input
                type="range"
                min="4"
                max="16"
                value={n}
                onChange={(e) => setN(parseInt(e.target.value))}
                className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                disabled={solving}
              />
              <div className="text-center mt-2 text-2xl font-bold text-purple-600">
                {n} Queens
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Algorithm
              </label>
              <select
                value={algorithm}
                onChange={(e) => setAlgorithm(e.target.value)}
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none text-gray-700 font-medium"
                disabled={solving}
              >
                <option value="csp">CSP with Constraint Propagation</option>
                <option value="dfs">DFS Backtracking</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Speed (ms)
              </label>
              <select
                value={speed}
                onChange={(e) => setSpeed(parseInt(e.target.value))}
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none text-gray-700 font-medium"
                disabled={solving}
              >
                <option value="1000">Slow (1s)</option>
                <option value="500">Medium (0.5s)</option>
                <option value="250">Fast (0.25s)</option>
                <option value="100">Very Fast (0.1s)</option>
                <option value="10">Very very Fast (0.01s)</option>
                <option value="1">Super Fast (0.001s)</option>
              </select>
            </div>
          </div>

          <div className="flex gap-4 mb-8">
            {!solving ? (
              <button
                onClick={handleSolve}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Play size={20} />
                Solve
              </button>
            ) : (
              <>
                <button
                  onClick={handlePause}
                  className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {isPaused ? <Play size={20} /> : <Pause size={20} />}
                  {isPaused ? 'Resume' : 'Pause'}
                </button>
                <button
                  onClick={handleStop}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <SkipForward size={20} />
                  Stop
                </button>
              </>
            )}
            <button
              onClick={resetBoard}
              disabled={solving}
              className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:bg-gray-400 flex items-center justify-center gap-2"
            >
              <RotateCcw size={20} />
              Reset
            </button>
          </div>

          <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-purple-500 rounded-lg">
            <div className="flex justify-between items-center">
              <p className="text-gray-800 font-medium">{message}</p>
              <span className="text-purple-600 font-bold">Steps: {stepCount}</span>
            </div>
          </div>

          <div className="flex justify-center mb-8">
            <div
              className="inline-grid gap-0 border-4 border-gray-800 rounded-lg overflow-hidden shadow-lg"
              style={{
                gridTemplateColumns: `repeat(${n}, ${cellSize}px)`,
              }}
            >
              {board.map((row, i) =>
                row.map((hasQueen, j) => (
                  <div
                    key={`${i}-${j}`}
                    className={`flex items-center justify-center transition-all duration-300 ${
                      (i + j) % 2 === 0 ? 'bg-amber-100' : 'bg-amber-700'
                    } ${hasQueen ? 'scale-110' : ''}`}
                    style={{
                      width: `${cellSize}px`,
                      height: `${cellSize}px`,
                    }}
                  >
                    {hasQueen && (
                      <span className="text-3xl animate-bounce">
                        ♛
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="p-6 bg-gray-50 rounded-lg">
            <h3 className="font-bold text-gray-800 mb-3">Algorithm Details:</h3>
            {algorithm === 'csp' ? (
              <div className="text-gray-700 space-y-2">
                <p><strong>CSP with Constraint Propagation</strong></p>
                <p className="text-sm">
                  Uses constraint satisfaction with domain reduction. Watch as it 
                  places queens column by column, pruning invalid choices based on 
                  constraints, and backtracks when no valid placement exists.
                </p>
              </div>
            ) : (
              <div className="text-gray-700 space-y-2">
                <p><strong>DFS Backtracking</strong></p>
                <p className="text-sm">
                  Explores placements row by row, checking safety at each step. 
                  Watch it try different positions and backtrack when conflicts 
                  are detected until a solution is found.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NQueensVisualizer;