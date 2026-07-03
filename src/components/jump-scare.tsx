import { useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, Image, Pressable, StyleSheet } from 'react-native';

import { playJumpScareSound } from '@/lib/scare-sound';

const SCARE_IMAGES = [
  require('../../assets/images/jumpscare/scare-1.png'),
  require('../../assets/images/jumpscare/scare-2.png'),
  require('../../assets/images/jumpscare/scare-3.png'),
  require('../../assets/images/jumpscare/scare-4.png'),
];

const AUTO_DISMISS_MS = 1800;

type JumpScareProps = {
  onDismiss: () => void;
};

export function JumpScare({ onDismiss }: JumpScareProps) {
  const scale = useRef(new Animated.Value(0.4)).current;
  const shakeX = useRef(new Animated.Value(0)).current;
  const flash = useRef(new Animated.Value(0.9)).current;

  const image = useMemo(() => SCARE_IMAGES[Math.floor(Math.random() * SCARE_IMAGES.length)], []);

  useEffect(() => {
    playJumpScareSound();

    Animated.parallel([
      Animated.spring(scale, { toValue: 1, friction: 4, tension: 140, useNativeDriver: true }),
      Animated.timing(flash, { toValue: 0, duration: 350, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      Animated.sequence([
        Animated.timing(shakeX, { toValue: 14, duration: 40, useNativeDriver: true }),
        Animated.timing(shakeX, { toValue: -14, duration: 40, useNativeDriver: true }),
        Animated.timing(shakeX, { toValue: 10, duration: 40, useNativeDriver: true }),
        Animated.timing(shakeX, { toValue: -6, duration: 40, useNativeDriver: true }),
        Animated.timing(shakeX, { toValue: 0, duration: 40, useNativeDriver: true }),
      ]),
    ]).start();

    const timer = setTimeout(onDismiss, AUTO_DISMISS_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Pressable style={styles.backdrop} onPress={onDismiss}>
      <Animated.View style={[styles.imageWrap, { transform: [{ scale }, { translateX: shakeX }] }]}>
        <Image source={image} style={styles.image} resizeMode="cover" />
      </Animated.View>
      <Animated.View style={[styles.flash, { opacity: flash, pointerEvents: 'none' }]} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  imageWrap: {
    width: '80%',
    maxWidth: 420,
    aspectRatio: 1,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#ff0000',
    shadowOpacity: 0.8,
    shadowRadius: 30,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  flash: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#ffffff',
  },
});
