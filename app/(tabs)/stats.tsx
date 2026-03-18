import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Pressable,
  ScrollView,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { PieChart, BarChart } from 'react-native-chart-kit';
import { ScreenContainer } from '../../components/screen-container';
import { useTransactions, TimeRange } from '../../hooks/use-transactions';
import { useColors } from '../../hooks/use-colors';
import { formatCurrency } from '../../utils/format';

const screenWidth = Dimensions.get('window').width - 32;

export default function StatsScreen() {
  const colors = useColors();
  const { calculateTotals, getGroupedByCategory } = useTransactions();

  const [timeRange, setTimeRange] = useState<TimeRange>('month');

  const totals = React.useMemo(() => calculateTotals(timeRange), [calculateTotals, timeRange]);
  const groupedByCategory = React.useMemo(
    () => getGroupedByCategory(timeRange),
    [getGroupedByCategory, timeRange]
  );

  const handleRangeChange = (range: TimeRange) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setTimeRange(range);
  };

  // Prepare pie chart data for expense categories
  const pieData = React.useMemo(() => {
    const expenseCategories = Object.entries(groupedByCategory)
      .filter(([_, values]) => values.expense > 0)
      .sort((a, b) => b[1].expense - a[1].expense)
      .slice(0, 6);

    const total = expenseCategories.reduce((sum, [_, v]) => sum + v.expense, 0);

    return expenseCategories.map(([category, values], index) => {
      const categoryColors = [
        '#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899',
      ];
      return {
        name: category,
        amount: values.expense,
        color: categoryColors[index % categoryColors.length],
        legendFontColor: colors.text,
        legendFontSize: 12,
        percentage: Math.round((values.expense / total) * 100),
      };
    });
  }, [groupedByCategory, colors.text]);

  // Prepare bar chart data for income vs expense comparison
  const barData = React.useMemo(() => {
    return {
      labels: ['收入', '支出'],
      datasets: [
        {
          data: [totals.income, totals.expense],
        },
      ],
    };
  }, [totals]);

  const chartConfig = {
    backgroundColor: colors.card,
    backgroundGradientFrom: colors.card,
    backgroundGradientTo: colors.card,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(79, 70, 229, ${opacity})`,
    labelColor: () => colors.textSecondary,
    style: {
      borderRadius: 16,
    },
    propsForBackgroundLines: {
      stroke: colors.border,
    },
  };

  const timeRangeOptions: TimeRange[] = ['week', 'month', 'year'];
  const timeRangeLabels = { week: '本周', month: '本月', year: '本年' };

  return (
    <ScreenContainer>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Time Range Selector */}
        <View style={styles.rangeSelector}>
          {timeRangeOptions.map((range) => (
            <Pressable
              key={range}
              style={({ pressed }) => [
                styles.rangeButton,
                timeRange === range && { backgroundColor: colors.primary },
                pressed && styles.rangeButtonPressed,
              ]}
              onPress={() => handleRangeChange(range)}
            >
              <Text
                style={[
                  styles.rangeText,
                  { color: timeRange === range ? '#FFFFFF' : colors.text },
                ]}
              >
                {timeRangeLabels[range]}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Summary Cards */}
        <View style={styles.summaryRow}>
          <View style={[styles.summaryCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>收入</Text>
            <Text style={[styles.summaryValue, { color: colors.secondary }]}>
              {formatCurrency(totals.income)}
            </Text>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>支出</Text>
            <Text style={[styles.summaryValue, { color: colors.danger }]}>
              {formatCurrency(totals.expense)}
            </Text>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>结余</Text>
            <Text style={[styles.summaryValue, { color: colors.text }]}>
              {formatCurrency(totals.balance)}
            </Text>
          </View>
        </View>

        {/* Income vs Expense Bar Chart */}
        <View style={[styles.chartCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.chartTitle, { color: colors.text }]}>收支对比</Text>
          {totals.income > 0 || totals.expense > 0 ? (
            <BarChart
              data={barData}
              width={screenWidth}
              height={200}
              chartConfig={{
                ...chartConfig,
                barPercentage: 0.5,
              }}
              style={styles.chart}
              yAxisLabel="¥"
              yAxisSuffix=""
              showValuesOnTopOfBars
            />
          ) : (
            <View style={styles.emptyChart}>
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>暂无数据</Text>
            </View>
          )}
        </View>

        {/* Expense Category Pie Chart */}
        <View style={[styles.chartCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.chartTitle, { color: colors.text }]}>支出分类</Text>
          {pieData.length > 0 ? (
            <PieChart
              data={pieData}
              width={screenWidth}
              height={220}
              chartConfig={chartConfig}
              accessor="amount"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />
          ) : (
            <View style={styles.emptyChart}>
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>暂无数据</Text>
            </View>
          )}
        </View>

        {/* Category Detail List */}
        <View style={[styles.chartCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.chartTitle, { color: colors.text }]}>分类明细</Text>
          {pieData.map((item, index) => (
            <View key={index} style={styles.categoryRow}>
              <View style={[styles.categoryDot, { backgroundColor: item.color }]} />
              <Text style={[styles.categoryName, { color: colors.text }]}>{item.name}</Text>
              <Text style={[styles.categoryPercent, { color: colors.textSecondary }]}>
                {item.percentage}%
              </Text>
              <Text style={[styles.categoryAmount, { color: colors.text }]}>
                ¥{item.amount.toFixed(0)}
              </Text>
            </View>
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  rangeSelector: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  rangeButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
  },
  rangeButtonPressed: {
    opacity: 0.8,
  },
  rangeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  summaryCard: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: '700',
  },
  chartCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  chart: {
    borderRadius: 16,
  },
  emptyChart: {
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  categoryDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  categoryName: {
    flex: 1,
    fontSize: 14,
  },
  categoryPercent: {
    fontSize: 13,
    marginRight: 12,
  },
  categoryAmount: {
    fontSize: 14,
    fontWeight: '600',
  },
});