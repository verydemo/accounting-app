import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useColors } from '../hooks/use-colors';
import { Transaction } from '../types/transaction';
import { CategoryIcon, getCategoryIconName } from './ui/icon-symbol';
import { formatCurrency, formatDateGroup } from '../utils/format';
import { useCategoryColor } from '../hooks/use-colors';

interface TransactionItemProps {
  transaction: Transaction;
  onPress?: () => void;
}

export function TransactionItem({ transaction, onPress }: TransactionItemProps) {
  const colors = useColors();
  const categoryColor = useCategoryColor(transaction.category);
  const isExpense = transaction.type === 'expense';

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress?.();
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        { backgroundColor: colors.card },
        pressed && styles.pressed,
      ]}
      onPress={handlePress}
    >
      <CategoryIcon
        category={transaction.category}
        size={44}
        backgroundColor={categoryColor + '20'}
      />
      <View style={styles.content}>
        <Text style={[styles.category, { color: colors.text }]} numberOfLines={1}>
          {transaction.category}
        </Text>
        {transaction.note ? (
          <Text style={[styles.note, { color: colors.textSecondary }]} numberOfLines={1}>
            {transaction.note}
          </Text>
        ) : null}
      </View>
      <Text
        style={[
          styles.amount,
          { color: isExpense ? colors.danger : colors.secondary },
        ]}
      >
        {isExpense ? '-' : '+'}
        {formatCurrency(transaction.amount).slice(1)}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  content: {
    flex: 1,
    marginLeft: 12,
  },
  category: {
    fontSize: 16,
    fontWeight: '600',
  },
  note: {
    fontSize: 13,
    marginTop: 2,
  },
  amount: {
    fontSize: 16,
    fontWeight: '700',
  },
});