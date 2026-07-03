import { StyleSheet, View } from 'react-native';

import { ThemedText } from './themed-text';

const DEPTH_LAYERS = [4, 3, 2, 1];

export function ExtrudedTitle({ children }: { children: string }) {
  return (
    <View style={styles.wrap}>
      <ThemedText type="brand" themeColor="accent" style={[styles.layer, styles.frontLayer]}>
        {children}
      </ThemedText>
      {DEPTH_LAYERS.map((offset) => (
        <ThemedText
          key={offset}
          type="brand"
          style={[styles.layer, styles.shadowLayer, { transform: [{ translateX: offset }, { translateY: offset }] }]}>
          {children}
        </ThemedText>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'relative',
  },
  layer: {
    textAlign: 'center',
  },
  frontLayer: {
    zIndex: 10,
  },
  shadowLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    color: '#3a0000',
    textShadowColor: 'transparent',
    textShadowRadius: 0,
  },
});
