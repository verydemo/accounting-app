import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  ScrollView,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, router } from 'expo-router';
import { ScreenContainer } from '../../components/screen-container';
import { CategoryIcon } from '../../components/ui/icon-symbol';
import { useTransactions } from '../../hooks/use-transactions';
import { useColors, useCategoryColor } from '../../hooks/use-colors';
import { formatCurrency, formatDateFull, formatDateTime } from '../../utils/format';
import { IconSymbol } from '../../components/ui/icon-symbol';

export default function DetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const { transactions, deleteTransaction, updateTransaction } = useTransactions();

  const transaction = React.useMemo(() => {
    return transactions.find((t) => t.id === id);
  }, [transactions, id]);

  const categoryColor = useCategoryColor(transaction?.category || '');
  const isExpense = transaction?.type === 'expense';

  const handleDelete = () => {
    Alert.alert('确认删除', '删除后无法恢复，确定要删除这条记录吗？', [
      { text: '取消', style: 'cancel' },
      {
        text: '删除',
        style: 'destructive',
        onPress: async () => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          await deleteTransaction(id);
          router.back();
        },
      },
    ]);
  };

  if (!transaction) {
    return (
      <ScreenContainer>
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            记录不存在
          </Text>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Amount Header */}
        <View style={styles.amountSection}>
          <CategoryIcon
            category={transaction.category}
            size={60}
            backgroundColor={categoryColor + '20'}
          />
          <Text
            style={[
              styles.amountText,
              { color: isExpense ? colors.danger : colors.secondary },
            ]}
          >
            {isExpense ? '-' : '+'}
            {formatCurrency(transaction.amount)}
          </Text>
          <Text style={[styles.categoryText, { color: colors.text }]}>
            {transaction.category}
          </Text>
        </View>

        {/* Detail Cards */}
        <View style={[styles.detailCard, { backgroundColor: colors.card }]}>
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>类型</Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>
              {isExpense ? '支出' : '收入'}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>日期</Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>
              {formatDateFull(transaction.date)}
            </Text>
          </View>
          {transaction.note && (
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>备注</Text>
              <Text style={[styles.detailValue, { color: colors.text }]}>
                {transaction.note}
              </Text>
            </View>
          )}
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>创建时间</Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>
              {formatDateTime(transaction.createdAt)}
            </Text>
          </View>
        </View>

        {/* Delete Button */}
        <Pressable
          style={({ pressed }) => [
            styles.deleteButton,
            pressed && styles.deleteButtonPressed,
          ]}
          onPress={handleDelete}
        >
          <IconSymbol name="trash" size={20} color={colors.danger} />
          <Text style={[styles.deleteButtonText, { color: colors.danger }]}>
            删除记录
          </Text>
        </Pressable>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 15,
  },
  amountSection: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  amountText: {
    fontSize: 36,
    fontWeight: '700',
    marginTop: 16,
  },
  categoryText: {
    fontSize: 18,
    fontWeight: '500',
    marginTop: 8,
  },
  detailCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  detailLabel: {
    fontSize: 15,
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '500',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#FEF2F2',
    marginBottom: 40,
  },
  deleteButtonPressed: {
    opacity: 0.8,
  },
  deleteButtonText: {
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 8,
  },
});