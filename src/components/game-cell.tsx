import { StyleSheet, View } from 'react-native';

import { Colors } from '@/constants/theme';
import { Cell } from '@/lib/connect-four';

import { GamePiece } from './game-piece';

type GameCellProps = {
  value: Cell;
  size: number;
  animateFromRows?: number;
  isWinning?: boolean;
};

export function GameCell({ value, size, animateFromRows = 0, isWinning = false }: GameCellProps) {
  const wellSize = size * 0.86;

  return (
    <View style={[styles.slot, { width: size, height: size }]}>
      <View style={[styles.well, { width: wellSize, height: wellSize, borderRadius: wellSize / 2 }]}>
        {value && (
          <GamePiece player={value} size={wellSize} animateFromRows={animateFromRows} isWinning={isWinning} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  slot: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  well: {
    backgroundColor: Colors.dark.boardWell,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.55)',
    borderTopColor: 'rgba(0,0,0,0.75)',
  },
});
