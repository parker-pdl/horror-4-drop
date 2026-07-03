import { useState } from 'react';
import { ImageBackground, Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';

import { Colors, MaxContentWidth, Spacing } from '@/constants/theme';
import { Board, COLS, ROWS } from '@/lib/connect-four';

import { GameCell } from './game-cell';

const BOARD_TEXTURE = require('../../assets/images/board-texture.png');

type LastDrop = { row: number; col: number } | null;

type GameBoardProps = {
  board: Board;
  onDropInColumn: (col: number) => void;
  lastDrop: LastDrop;
  winningCells: [number, number][];
  disabled: boolean;
};

export function GameBoard({ board, onDropInColumn, lastDrop, winningCells, disabled }: GameBoardProps) {
  const { width, height } = useWindowDimensions();
  const [hoveredCol, setHoveredCol] = useState<number | null>(null);

  const boardWidth = Math.min(width, MaxContentWidth) - Spacing.four * 2;
  // The perspective tilt makes the board's near (bottom) edge project visually
  // wider than its flat layout box, so shrink the width budget it's sized against.
  const TILT_WIDTH_SAFETY = 0.88;
  const maxCellFromWidth = Math.floor((boardWidth * TILT_WIDTH_SAFETY) / COLS);

  // Leave room for the title, difficulty picker, status banner, and footer above/below the board.
  const reservedHeight = 380;
  const availableHeight = Math.max(220, height - reservedHeight);
  const maxCellFromHeight = Math.floor(availableHeight / ROWS);

  const cellSize = Math.max(36, Math.min(90, maxCellFromWidth, maxCellFromHeight));

  const isWinningCell = (row: number, col: number) =>
    winningCells.some(([winRow, winCol]) => winRow === row && winCol === col);

  return (
    <View style={styles.frameWrap}>
      <ImageBackground source={BOARD_TEXTURE} style={styles.frame} imageStyle={styles.frameImage} resizeMode="cover">
        <View style={styles.frameOverlay} />
        <View style={styles.frameHighlight} />
        <View style={styles.grid}>
          {Array.from({ length: COLS }, (_, col) => (
            <Pressable
              key={col}
              disabled={disabled}
              onPress={() => onDropInColumn(col)}
              onHoverIn={() => setHoveredCol(col)}
              onHoverOut={() => setHoveredCol((current) => (current === col ? null : current))}
              style={({ pressed }) => [styles.column, pressed && !disabled && styles.columnPressed]}>
              {!disabled && hoveredCol === col && <View style={styles.hoverIndicator} />}
              {Array.from({ length: ROWS }, (_, row) => (
                <GameCell
                  key={row}
                  value={board[row][col]}
                  size={cellSize}
                  animateFromRows={lastDrop && lastDrop.row === row && lastDrop.col === col ? row + 1 : 0}
                  isWinning={isWinningCell(row, col)}
                />
              ))}
            </Pressable>
          ))}
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  frameWrap: {
    transform: [{ perspective: 700 }, { rotateX: '14deg' }],
    shadowColor: '#000000',
    shadowOpacity: 0.7,
    shadowRadius: 26,
    shadowOffset: { width: 0, height: 24 },
  },
  frame: {
    backgroundColor: Colors.dark.backgroundElement,
    borderRadius: Spacing.three,
    padding: Spacing.two,
    borderWidth: 2,
    borderColor: '#3a1010',
    borderBottomWidth: 6,
    borderBottomColor: '#1a0505',
    overflow: 'hidden',
  },
  frameImage: {
    borderRadius: Spacing.three,
  },
  frameOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  frameHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '30%',
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  grid: {
    flexDirection: 'row',
  },
  column: {
    alignItems: 'center',
    position: 'relative',
  },
  columnPressed: {
    opacity: 0.85,
  },
  hoverIndicator: {
    position: 'absolute',
    top: -Spacing.two,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.dark.accent,
  },
});
