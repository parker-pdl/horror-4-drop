import { Image, StyleSheet, View } from 'react-native';

const PDL_LOGO = require('../../assets/images/pdl-logo.png');

export function PdlFooter() {
  return (
    <View style={styles.wrap}>
      <Image source={PDL_LOGO} style={styles.logo} resizeMode="contain" />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    bottom: 8,
    left: 0,
    right: 0,
    alignItems: 'center',
    pointerEvents: 'none',
  },
  logo: {
    width: 170,
    height: 78,
    opacity: 0.85,
  },
});
