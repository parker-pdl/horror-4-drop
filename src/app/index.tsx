import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AmbientDecor } from '@/components/ambient-decor';
import { DifficultyPicker } from '@/components/difficulty-picker';
import { ExtrudedTitle } from '@/components/extruded-title';
import { FloatingMascot } from '@/components/floating-mascot';
import { GameBoard } from '@/components/game-board';
import { JumpScare } from '@/components/jump-scare';
import { PdlFooter } from '@/components/pdl-footer';
import { PlayerWinPopup } from '@/components/player-win-popup';
import { StatusBanner } from '@/components/status-banner';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useConnectFourGame } from '@/hooks/use-connect-four-game';

export default function GameScreen() {
  const game = useConnectFourGame();
  const [jumpScareVisible, setJumpScareVisible] = useState(false);

  const boardDisabled = game.status.state !== 'playing' || game.currentPlayer !== 'red' || game.isAiThinking;
  const ghostWon = game.status.state === 'won' && game.status.winner === 'ghost';
  const playerWon = game.status.state === 'won' && game.status.winner === 'red';

  useEffect(() => {
    if (ghostWon) setJumpScareVisible(true);
  }, [ghostWon]);

  return (
    <ThemedView style={styles.container}>
      <AmbientDecor />

      <SafeAreaView style={styles.safeArea}>
        <FloatingMascot />

        <ExtrudedTitle>Horror 4 Drop</ExtrudedTitle>
        <ThemedText type="small" themeColor="textSecondary" style={styles.tagline}>
          Haunted Four in a Row
        </ThemedText>

        <DifficultyPicker value={game.difficulty} onChange={game.setDifficulty} disabled={game.isAiThinking} />

        <StatusBanner
          status={game.status}
          currentPlayer={game.currentPlayer}
          isAiThinking={game.isAiThinking}
          onPlayAgain={game.resetGame}
        />

        {playerWon && <PlayerWinPopup />}

        <GameBoard
          board={game.board}
          onDropInColumn={game.dropInColumn}
          lastDrop={game.lastDrop}
          winningCells={game.status.state === 'won' ? game.status.cells : []}
          disabled={boardDisabled}
        />
      </SafeAreaView>

      <PdlFooter />

      {jumpScareVisible && <JumpScare onDismiss={() => setJumpScareVisible(false)} />}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.five,
    paddingBottom: 104,
    gap: Spacing.three,
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    width: '100%',
  },
  tagline: {
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginTop: -Spacing.two,
  },
});
