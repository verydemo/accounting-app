import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '../../hooks/use-colors';

interface IconSymbolProps {
  name: string;
  size?: number;
  color?: string;
}

// Map SF Symbol names to Ionicons
const iconNameMap: Record<string, keyof typeof Ionicons.glyphMap> = {
  // Tabs
  'house': 'home-outline',
  'house.fill': 'home',
  'plus.circle': 'add-circle-outline',
  'plus.circle.fill': 'add-circle',
  'chart.bar': 'bar-chart-outline',
  'chart.bar.fill': 'bar-chart',
  // Categories
  'fork.knife': 'restaurant-outline',
  'car': 'car-outline',
  'cart': 'cart-outline',
  'gamecontroller': 'game-controller-outline',
  'cross.case': 'medkit-outline',
  'book': 'book-outline',
  'briefcase': 'briefcase-outline',
  'gift': 'gift-outline',
  'chart.line.uptrend.xyaxis': 'trending-up-outline',
  'person.crop.circle.badge.clock': 'time-outline',
  // Actions
  'ellipsis': 'ellipsis-horizontal',
  'trash': 'trash-outline',
  'pencil': 'pencil-outline',
  'checkmark': 'checkmark',
  'xmark': 'close',
  'arrow.left': 'arrow-back',
  'arrow.clockwise': 'refresh-outline',
  'chevron.right': 'chevron-forward',
  'chevron.left': 'chevron-back',
  'chevron.up': 'chevron-up',
  'chevron.down': 'chevron-down',
};

export function IconSymbol({ name, size = 24, color }: IconSymbolProps) {
  const colors = useColors();
  const iconColor = color || colors.text;
  const iconName = iconNameMap[name] || 'help-circle-outline';

  return <Ionicons name={iconName} size={size} color={iconColor} />;
}

// Tab bar icon component
interface TabIconProps {
  name: string;
  focusedName: string;
  focused: boolean;
  color: string;
  size?: number;
}

export function TabIcon({ name, focusedName, focused, color, size = 24 }: TabIconProps) {
  return (
    <IconSymbol
      name={focused ? focusedName : name}
      size={size}
      color={color}
    />
  );
}

// Category icon with background
interface CategoryIconProps {
  category: string;
  size?: number;
  backgroundColor?: string;
}

export function CategoryIcon({ category, size = 40, backgroundColor }: CategoryIconProps) {
  const colors = useColors();
  const iconName = getCategoryIconName(category);

  return (
    <View
      style={[
        styles.categoryIcon,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: backgroundColor || colors.primary + '20',
        },
      ]}
    >
      <IconSymbol name={iconName} size={size * 0.5} color={colors.primary} />
    </View>
  );
}

// Map category to icon name
export function getCategoryIconName(category: string): string {
  const mapping: Record<string, string> = {
    餐饮: 'fork.knife',
    交通: 'car',
    购物: 'cart',
    娱乐: 'gamecontroller',
    医疗: 'cross.case',
    教育: 'book',
    居住: 'house.fill',
    其他: 'ellipsis',
    工资: 'briefcase',
    奖金: 'gift',
    投资: 'chart.line.uptrend.xyaxis',
    兼职: 'person.crop.circle.badge.clock',
  };
  return mapping[category] || 'ellipsis';
}

const styles = StyleSheet.create({
  categoryIcon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});