import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useColors, useCategoryColor } from '../hooks/use-colors';
import { IconSymbol } from './ui/icon-symbol';
import { getCategoryIconName } from './ui/icon-symbol';

interface CategoryPickerProps {
  categories: readonly string[];
  selected: string;
  onSelect: (category: string) => void;
  type: 'income' | 'expense';
}

export function CategoryPicker({ categories, selected, onSelect, type }: CategoryPickerProps) {
  const colors = useColors();

  const handleSelect = (category: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSelect(category);
  };

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {categories.map((category) => {
          const isSelected = selected === category;
          const categoryColor = useCategoryColor(category);

          return (
            <Pressable
              key={category}
              style={({ pressed }) => [
                styles.item,
                {
                  backgroundColor: isSelected ? categoryColor + '20' : colors.card,
                  borderColor: isSelected ? categoryColor : colors.border,
                  transform: [{ scale: pressed ? 0.95 : 1 }],
                },
              ]}
              onPress={() => handleSelect(category)}
            >
              <IconSymbol
                name={getCategoryIconName(category)}
                size={24}
                color={isSelected ? categoryColor : colors.textSecondary}
              />
              <Text
                style={[
                  styles.label,
                  { color: isSelected ? categoryColor : colors.text },
                ]}
              >
                {category}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  item: {
    width: '22%',
    aspectRatio: 1,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
});