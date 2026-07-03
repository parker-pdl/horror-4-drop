import { useCallback, useEffect, useReducer, useState } from 'react';

import {
  Board,
  Player,
  checkDraw,
  checkWin,
  createEmptyBoard,
  dropPiece,
} from '@/lib/connect-four';
import { Difficulty, getGhostMove } from '@/lib/ghost-ai';

export type GameStatus =
  | { state: 'playing' }
  | { state: 'won'; winner: Player; cells: [number, number][] }
  | { state: 'draw' };

type LastDrop = { row: number; col: number; player: Player };

type GameState = {
  board: Board;
  currentPlayer: Player;
  status: GameStatus;
  difficulty: Difficulty;
  lastDrop: LastDrop | null;
};

type Action =
  | { type: 'DROP'; col: number; player: Player }
  | { type: 'RESET' }
  | { type: 'SET_DIFFICULTY'; difficulty: Difficulty };

function initialState(difficulty: Difficulty): GameState {
  return {
    board: createEmptyBoard(),
    currentPlayer: 'red',
    status: { state: 'playing' },
    difficulty,
    lastDrop: null,
  };
}

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'DROP': {
      if (state.status.state !== 'playing' || action.player !== state.currentPlayer) return state;

      const result = dropPiece(state.board, action.col, action.player);
      if (!result) return state;

      const win = checkWin(result.board, result.row, action.col);
      const draw = !win && checkDraw(result.board);

      return {
        ...state,
        board: result.board,
        currentPlayer: action.player === 'red' ? 'ghost' : 'red',
        status: win
          ? { state: 'won', winner: win.player, cells: win.cells }
          : draw
            ? { state: 'draw' }
            : { state: 'playing' },
        lastDrop: { row: result.row, col: action.col, player: action.player },
      };
    }
    case 'RESET':
      return initialState(state.difficulty);
    case 'SET_DIFFICULTY':
      return initialState(action.difficulty);
    default:
      return state;
  }
}

const AI_THINK_DELAY_MS = 500;

export function useConnectFourGame(initialDifficulty: Difficulty = 'medium') {
  const [state, dispatch] = useReducer(reducer, initialDifficulty, initialState);
  const [isAiThinking, setIsAiThinking] = useState(false);

  const dropInColumn = useCallback(
    (col: number) => {
      if (state.status.state !== 'playing' || state.currentPlayer !== 'red' || isAiThinking) return;
      dispatch({ type: 'DROP', col, player: 'red' });
    },
    [state.status.state, state.currentPlayer, isAiThinking],
  );

  const resetGame = useCallback(() => dispatch({ type: 'RESET' }), []);

  const setDifficulty = useCallback(
    (difficulty: Difficulty) => dispatch({ type: 'SET_DIFFICULTY', difficulty }),
    [],
  );

  useEffect(() => {
    if (state.status.state !== 'playing' || state.currentPlayer !== 'ghost') return;

    setIsAiThinking(true);
    const timer = setTimeout(() => {
      const col = getGhostMove(state.board, state.difficulty);
      if (col !== -1) dispatch({ type: 'DROP', col, player: 'ghost' });
      setIsAiThinking(false);
    }, AI_THINK_DELAY_MS);

    return () => clearTimeout(timer);
  }, [state.board, state.currentPlayer, state.status.state, state.difficulty]);

  return {
    board: state.board,
    currentPlayer: state.currentPlayer,
    status: state.status,
    difficulty: state.difficulty,
    lastDrop: state.lastDrop,
    isAiThinking,
    dropInColumn,
    resetGame,
    setDifficulty,
  };
}
