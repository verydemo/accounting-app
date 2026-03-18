import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { ScreenContainer } from '../../components/screen-container';
import { CategoryPicker } from '../../components/category-picker';
import { useTransactions } from '../../hooks/use-transactions';
import { useColors } from '../../hooks/use-colors';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, TransactionType } from '../../types/transaction';
import { getTodayString } from '../../utils/format';

export default function AddScreen() {
  const colors = useColors();
  const { addTransaction } = useTransactions();

  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<string>(EXPENSE_CATEGORIES[0]);
  const [note, setNote] = useState('');
  const [date] = useState(getTodayString());

  // Update category when type changes
  React.useEffect(() => {
    setCategory(type === 'expense' ? EXPENSE_CATEGORIES[0] : INCOME_CATEGORIES[0]);
  }, [type]);

  const handleTypeChange = (newType: TransactionType) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setType(newType);
  };

  const handleSave = async () => {
    const amountNum = parseFloat(amount);

    if (!amount || isNaN(amountNum) || amountNum <= 0) {
      Alert.alert('提示', '请输入有效金额');
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    await addTransaction({
      type,
      amount: amountNum,
      category,
      note: note.trim() || undefined,
      date,
    });

    // Reset form
    setAmount('');
    setNote('');
    setCategory(EXPENSE_CATEGORIES[0]);
    setType('expense');

    Alert.alert('成功', '记录已保存', [
      { text: '继续记账', style: 'default' },
      { text: '返回首页', onPress: () => router.back(), style: 'cancel' },
    ]);
  };

  const categories = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  return (
    <ScreenContainer>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Type Selector */}
          <View style={styles.typeSelector}>
            <Pressable
              style={({ pressed }) => [
                styles.typeButton,
                type === 'expense' && { backgroundColor: colors.danger },
                pressed && styles.typeButtonPressed,
              ]}
              onPress={() => handleTypeChange('expense')}
            >
              <Text style={[styles.typeText, type === 'expense' && styles.typeTextActive]}>
                支出
              </Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                styles.typeButton,
                type === 'income' && { backgroundColor: colors.secondary },
                pressed && styles.typeButtonPressed,
              ]}
              onPress={() => handleTypeChange('income')}
            >
              <Text style={[styles.typeText, type === 'income' && styles.typeTextActive]}>
                收入
              </Text>
            </Pressable>
          </View>

          {/* Amount Input */}
          <View style={styles.amountSection}>
            <Text style={[styles.amountLabel, { color: colors.textSecondary }]}>金额</Text>
            <View style={styles.amountRow}>
              <Text style={[styles.currencySymbol, { color: colors.text }]}>¥</Text>
              <TextInput
                style={[styles.amountInput, { color: colors.text }]}
                value={amount}
                onChangeText={setAmount}
                placeholder="0.00"
                placeholderTextColor={colors.textSecondary}
                keyboardType="decimal-pad"
                autoFocus
              />
            </View>
          </View>

          {/* Category Picker */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>分类</Text>
            <CategoryPicker
              categories={categories}
              selected={category}
              onSelect={setCategory}
              type={type}
            />
          </View>

          {/* Note Input */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>备注</Text>
            <TextInput
              style={[
                styles.noteInput,
                { backgroundColor: colors.card, color: colors.text, borderColor: colors.border },
              ]}
              value={note}
              onChangeText={setNote}
              placeholder="添加备注（可选）"
              placeholderTextColor={colors.textSecondary}
              multiline
              numberOfLines={2}
            />
          </View>

          {/* Save Button */}
          <Pressable
            style={({ pressed }) => [
              styles.saveButton,
              { backgroundColor: colors.primary },
              pressed && styles.saveButtonPressed,
            ]}
            onPress={handleSave}
          >
            <Text style={styles.saveButtonText}>保存</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  typeSelector: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
  },
  typeButtonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  typeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  typeTextActive: {
    color: '#FFFFFF',
  },
  amountSection: {
    marginBottom: 24,
  },
  amountLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencySymbol: {
    fontSize: 32,
    fontWeight: '700',
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 40,
    fontWeight: '700',
    padding: 0,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  noteInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  saveButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 40,
  },
  saveButtonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
});