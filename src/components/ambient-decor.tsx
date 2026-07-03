import { useEffect, useRef } from 'react';
import { Animated, Easing, Image, StyleSheet, View } from 'react-native';

const GHOST_HOODED = require('../../assets/images/decor/ghost-hooded.png');
const DEMON_1 = require('../../assets/images/decor/demon-1.png');
const DEMON_2 = require('../../assets/images/decor/demon-2.png');

type Percent = `${number}%`;

type Figure = {
  key: string;
  source: number;
  size: number;
  top?: Percent;
  bottom?: Percent;
  left?: Percent;
  right?: Percent;
  mirrored?: boolean;
  delay: number;
  minOpacity: number;
  maxOpacity: number;
};

const FIGURES: Figure[] = [
  { key: 'tl', source: GHOST_HOODED, size: 120, top: '4%', left: '2%', delay: 0, minOpacity: 0.14, maxOpacity: 0.3 },
  { key: 'bl', source: DEMON_1, size: 150, bottom: '6%', left: '1%', delay: 600, minOpacity: 0.1, maxOpacity: 0.24 },
  {
    key: 'br',
    source: DEMON_2,
    size: 150,
    bottom: '8%',
    right: '1%',
    mirrored: true,
    delay: 1200,
    minOpacity: 0.1,
    maxOpacity: 0.24,
  },
  {
    key: 'mr',
    source: GHOST_HOODED,
    size: 100,
    top: '38%',
    right: '3%',
    mirrored: true,
    delay: 1800,
    minOpacity: 0.12,
    maxOpacity: 0.26,
  },
  { key: 'ml', source: DEMON_1, size: 90, top: '52%', left: '3%', delay: 900, minOpacity: 0.1, maxOpacity: 0.2 },
];

function AmbientFigure({ figure }: { figure: Figure }) {
  const opacity = useRef(new Animated.Value(figure.minOpacity)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: figure.maxOpacity,
          duration: 3200,
          delay: figure.delay,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: figure.minOpacity,
          duration: 3200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [figure, opacity]);

  return (
    <Animated.View
      style={[
        styles.figure,
        {
          width: figure.size,
          height: figure.size,
          top: figure.top,
          bottom: figure.bottom,
          left: figure.left,
          right: figure.right,
          opacity,
          transform: figure.mirrored ? [{ scaleX: -1 }] : undefined,
        },
      ]}>
      <Image source={figure.source} style={styles.image} resizeMode="contain" />
    </Animated.View>
  );
}

export function AmbientDecor() {
  return (
    <View style={styles.container}>
      {FIGURES.map((figure) => (
        <AmbientFigure key={figure.key} figure={figure} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  figure: {
    position: 'absolute',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
