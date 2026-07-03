import { useEffect, useRef } from 'react';
import { Animated, Easing, Image, StyleSheet } from 'react-native';

import { playVictoryChime } from '@/lib/scare-sound';

const WIN_IMAGE = require('../../assets/images/player-win.png');

export function PlayerWinPopup() {
  const scale = useRef(new Animated.Value(0.6)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    playVictoryChime();

    Animated.parallel([
      Animated.spring(scale, { toValue: 1, friction: 5, tension: 120, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 300, easing: Easing.out(Easing.quad), useNativeDriver: true }),
    ]).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Animated.View style={[styles.wrap, { opacity, transform: [{ scale }] }]}>
      <Image source={WIN_IMAGE} style={styles.image} resizeMode="cover" />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: 160,
    height: 160,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#e10600',
    shadowColor: '#e10600',
    shadowOpacity: 0.6,
    shadowRadius: 16,
    alignSelf: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
