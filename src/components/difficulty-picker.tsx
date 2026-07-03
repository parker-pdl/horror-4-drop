import { Pressable, StyleSheet, View } from 'react-native';

import { Colors, Spacing } from '@/constants/theme';
import { Difficulty } from '@/lib/ghost-ai';

import { ThemedText } from './themed-text';

const OPTIONS: { value: Difficulty; label: string }[] = [
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
];

type DifficultyPickerProps = {
  value: Difficulty;
  onChange: (difficulty: Difficulty) => void;
  disabled?: boolean;
};

export function DifficultyPicker({ value, onChange, disabled }: DifficultyPickerProps) {
  return (
    <View style={styles.row}>
      {OPTIONS.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.value}
            disabled={disabled}
            onPress={() => onChange(option.value)}
            style={({ pressed }) => [
              styles.chip,
              selected && styles.chipSelected,
              pressed && !disabled && styles.chipPressed,
            ]}>
            <ThemedText type="small" themeColor={selected ? 'text' : 'textSecondary'}>
              {option.label}
            </ThemedText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  chip: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
    borderRadius: Spacing.five,
    backgroundColor: Colors.dark.backgroundElement,
    borderWidth: 1,
    borderColor: 'transparent',
    borderBottomWidth: 3,
    borderBottomColor: 'rgba(0,0,0,0.5)',
  },
  chipSelected: {
    borderColor: Colors.dark.accent,
    backgroundColor: Colors.dark.backgroundSelected,
  },
  chipPressed: {
    borderBottomWidth: 1,
    transform: [{ translateY: 2 }],
  },
});
