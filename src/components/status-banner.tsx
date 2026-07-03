import { Pressable, StyleSheet } from 'react-native';

import { Colors, Spacing } from '@/constants/theme';

import { GameStatus } from '@/hooks/use-connect-four-game';
import { Player } from '@/lib/connect-four';

import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

type StatusBannerProps = {
  status: GameStatus;
  currentPlayer: Player;
  isAiThinking: boolean;
  onPlayAgain: () => void;
};

export function StatusBanner({ status, currentPlayer, isAiThinking, onPlayAgain }: StatusBannerProps) {
  return (
    <ThemedView type="backgroundElement" style={styles.banner}>
      {status.state === 'playing' && (
        <ThemedText type="smallBold">
          {isAiThinking ? '👻 The ghost is thinking…' : currentPlayer === 'red' ? 'Your move' : "Ghost's move"}
        </ThemedText>
      )}

      {status.state === 'won' && (
        <>
          <ThemedText type="smallBold" themeColor="accent">
            {status.winner === 'red' ? 'You win! 🎉' : 'The ghost wins! 👻'}
          </ThemedText>
          <Pressable
            onPress={onPlayAgain}
            style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}>
            <ThemedText type="small">Play Again</ThemedText>
          </Pressable>
        </>
      )}

      {status.state === 'draw' && (
        <>
          <ThemedText type="smallBold">It&rsquo;s a draw!</ThemedText>
          <Pressable
            onPress={onPlayAgain}
            style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}>
            <ThemedText type="small">Play Again</ThemedText>
          </Pressable>
        </>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  banner: {
    minHeight: 56,
    borderRadius: Spacing.three,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.three,
  },
  button: {
    backgroundColor: Colors.dark.accent,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
    borderRadius: Spacing.two,
    borderBottomWidth: 3,
    borderBottomColor: '#7a0f1f',
  },
  buttonPressed: {
    borderBottomWidth: 1,
    transform: [{ translateY: 2 }],
  },
});
