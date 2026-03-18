import React from 'react';
import { View, Text, Pressable, StyleSheet, FlatList } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useColors } from '../hooks/use-colors';
import { TransactionItem } from './transaction-item';
import { Transaction } from '../types/transaction';
import { formatDateGroup } from '../utils/format';

interface TransactionListProps {
  transactions: Transaction[];
  onItemPress?: (transaction: Transaction) => void;
}

interface GroupedTransactions {
  date: string;
  data: Transaction[];
  totalExpense: number;
  totalIncome: number;
}

export function TransactionList({ transactions, onItemPress }: TransactionListProps) {
  const colors = useColors();

  // Group transactions by date
  const groupedData = React.useMemo(() => {
    const groups: Record<string, Transaction[]> = {};

    transactions.forEach((t) => {
      if (!groups[t.date]) {
        groups[t.date] = [];
      }
      groups[t.date].push(t);
    });

    return Object.entries(groups)
      .sort((a, b) => b[0].localeCompare(a[0]))
      .map(([date, data]) => {
        const totalExpense = data
          .filter((t) => t.type === 'expense')
          .reduce((sum, t) => sum + t.amount, 0);
        const totalIncome = data
          .filter((t) => t.type === 'income')
          .reduce((sum, t) => sum + t.amount, 0);
        return { date, data, totalExpense, totalIncome };
      });
  }, [transactions]);

  const renderDateHeader = (group: GroupedTransactions) => (
    <View style={[styles.dateHeader, { backgroundColor: colors.background }]}>
      <Text style={[styles.dateText, { color: colors.text }]}>
        {formatDateGroup(group.date)}
      </Text>
      <View style={styles.dateTotals}>
        {group.totalIncome > 0 && (
          <Text style={[styles.incomeText, { color: colors.secondary }]}>
            +{group.totalIncome.toFixed(0)}
          </Text>
        )}
        {group.totalExpense > 0 && (
          <Text style={[styles.expenseText, { color: colors.danger }]}>
            -{group.totalExpense.toFixed(0)}
          </Text>
        )}
      </View>
    </View>
  );

  const renderItem = ({ item }: { item: Transaction }) => (
    <TransactionItem transaction={item} onPress={() => onItemPress?.(item)} />
  );

  const renderGroup = ({ item }: { item: GroupedTransactions }) => (
    <View style={styles.group}>
      {renderDateHeader(item)}
      {item.data.map((t) => (
        <TransactionItem key={t.id} transaction={t} onPress={() => onItemPress?.(t)} />
      ))}
    </View>
  );

  return (
    <FlatList
      data={groupedData}
      renderItem={renderGroup}
      keyExtractor={(item) => item.date}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.listContent}
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 100,
  },
  group: {
    marginBottom: 8,
  },
  dateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  dateText: {
    fontSize: 14,
    fontWeight: '600',
  },
  dateTotals: {
    flexDirection: 'row',
    gap: 12,
  },
  incomeText: {
    fontSize: 13,
    fontWeight: '500',
  },
  expenseText: {
    fontSize: 13,
    fontWeight: '500',
  },
});