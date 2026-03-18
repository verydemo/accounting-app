import React from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { ScreenContainer } from '../../components/screen-container';
import { TransactionList } from '../../components/transaction-list';
import { useTransactions } from '../../hooks/use-transactions';
import { useColors } from '../../hooks/use-colors';
import { formatCurrency } from '../../utils/format';
import { Transaction } from '../../types/transaction';

export default function HomeScreen() {
  const { transactions, loading, calculateTotals } = useTransactions();
  const colors = useColors();
  const totals = React.useMemo(() => calculateTotals('month'), [calculateTotals, transactions]);

  const handleItemPress = (transaction: Transaction) => {
    router.push(`/detail/${transaction.id}`);
  };

  const handleAddPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/add');
  };

  if (loading) {
    return (
      <ScreenContainer>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer noPadding>
      {/* Header Card */}
      <View style={[styles.headerCard, { backgroundColor: colors.primary }]}>
        <Text style={styles.headerTitle}>本月收支</Text>
        <View style={styles.totalsRow}>
          <View style={styles.totalItem}>
            <Text style={styles.totalLabel}>收入</Text>
            <Text style={styles.totalValue}>{formatCurrency(totals.income)}</Text>
          </View>
          <View style={styles.totalDivider} />
          <View style={styles.totalItem}>
            <Text style={styles.totalLabel}>支出</Text>
            <Text style={[styles.totalValue, { color: '#FCA5A5' }]}>
              {formatCurrency(totals.expense)}
            </Text>
          </View>
        </View>
        <View style={styles.balanceRow}>
          <Text style={styles.balanceLabel}>结余</Text>
          <Text style={styles.balanceValue}>{formatCurrency(totals.balance)}</Text>
        </View>
      </View>

      {/* Transaction List */}
      <View style={styles.listContainer}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>交易记录</Text>
        {transactions.length > 0 ? (
          <TransactionList transactions={transactions} onItemPress={handleItemPress} />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              暂无记录，点击下方添加
            </Text>
          </View>
        )}
      </View>

      {/* FAB */}
      <Pressable
        style={({ pressed }) => [
          styles.fab,
          { backgroundColor: colors.primary },
          pressed && { transform: [{ scale: 0.95 }] },
        ]}
        onPress={handleAddPress}
      >
        <Text style={styles.fabText}>+</Text>
      </Pressable>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCard: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    opacity: 0.9,
  },
  totalsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  totalItem: {
    flex: 1,
  },
  totalLabel: {
    color: '#FFFFFF',
    fontSize: 13,
    opacity: 0.8,
  },
  totalValue: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
    marginTop: 4,
  },
  totalDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginHorizontal: 16,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
  },
  balanceLabel: {
    color: '#FFFFFF',
    fontSize: 14,
    opacity: 0.8,
  },
  balanceValue: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 12,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 15,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 90,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabText: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '300',
  },
});