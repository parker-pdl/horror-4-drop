import { useEffect, useRef } from 'react';
import { Animated, Easing, Image, StyleSheet, View } from 'react-native';

import { Colors } from '@/constants/theme';
import { Player } from '@/lib/connect-four';

const GHOST_PIECE_IMAGE = require('../../assets/images/ghost-piece.png');

type GamePieceProps = {
  player: Player;
  size: number;
  /** Number of cell-heights to drop in from above; 0 disables the animation. */
  animateFromRows?: number;
  isWinning?: boolean;
};

export function GamePiece({ player, size, animateFromRows = 0, isWinning = false }: GamePieceProps) {
  const translateY = useRef(new Animated.Value(animateFromRows > 0 ? -animateFromRows * size : 0)).current;

  useEffect(() => {
    if (animateFromRows <= 0) return;
    Animated.timing(translateY, {
      toValue: 0,
      duration: 320 + animateFromRows * 30,
      easing: Easing.bounce,
      useNativeDriver: true,
    }).start();
    // Animate only on mount for this specific drop; the piece is static afterwards.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hornWidth = size * 0.16;
  const hornHeight = size * 0.22;

  return (
    <Animated.View
      style={[
        styles.piece,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          transform: [{ translateY }],
        },
        isWinning && styles.winning,
      ]}>
      {player === 'ghost' ? (
        <View style={[styles.circleClip, { width: size, height: size, borderRadius: size / 2 }]}>
          <Image source={GHOST_PIECE_IMAGE} style={styles.ghostImage} resizeMode="cover" />
        </View>
      ) : (
        <>
          <View
            style={[
              styles.hornLeft,
              {
                borderLeftWidth: hornWidth / 2,
                borderRightWidth: hornWidth / 2,
                borderBottomWidth: hornHeight,
                top: 0,
                left: size * 0.1,
              },
            ]}
          />
          <View
            style={[
              styles.hornRight,
              {
                borderLeftWidth: hornWidth / 2,
                borderRightWidth: hornWidth / 2,
                borderBottomWidth: hornHeight,
                top: 0,
                right: size * 0.1,
              },
            ]}
          />
          <View
            style={[
              styles.redBase,
              { width: size, height: size, borderRadius: size / 2, borderWidth: Math.max(1, size * 0.05) },
            ]}
          />
          <View
            style={[
              styles.highlight,
              {
                width: size * 0.4,
                height: size * 0.32,
                borderRadius: size * 0.2,
                top: size * 0.12,
                left: size * 0.16,
              },
            ]}
          />
        </>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  piece: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    shadowColor: '#000000',
    shadowOpacity: 0.4,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
  winning: {
    shadowColor: '#e10600',
    shadowOpacity: 0.9,
    shadowRadius: 10,
  },
  circleClip: {
    overflow: 'hidden',
  },
  ghostImage: {
    width: '100%',
    height: '100%',
  },
  redBase: {
    position: 'absolute',
    backgroundColor: Colors.dark.pieceRed,
    borderColor: '#7a0f1f',
  },
  highlight: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  hornLeft: {
    position: 'absolute',
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#7a0f1f',
    transform: [{ rotate: '-18deg' }],
  },
  hornRight: {
    position: 'absolute',
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#7a0f1f',
    transform: [{ rotate: '18deg' }],
  },
});
