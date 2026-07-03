import { useEffect, useRef } from 'react';
import { Animated, Easing, Image, StyleSheet } from 'react-native';

const MASCOT_IMAGE = require('../../assets/images/ghost-mascot.png');

export function FloatingMascot() {
  const bob = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(bob, { toValue: 1, duration: 1600, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(bob, { toValue: 0, duration: 1600, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [bob]);

  const translateY = bob.interpolate({ inputRange: [0, 1], outputRange: [0, -10] });

  return (
    <Animated.View style={[styles.wrap, { transform: [{ translateY }], pointerEvents: 'none' }]}>
      <Image source={MASCOT_IMAGE} style={styles.image} resizeMode="contain" />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    top: 4,
    right: 8,
    width: 56,
    height: 56,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
