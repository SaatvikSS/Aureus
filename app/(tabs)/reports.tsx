import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { useTransactionStore } from '@/store/transactionStore';
import { usePreferencesStore } from '@/store/preferencesStore';
import TimeRangePicker from '@/components/TimeRangePicker';
import CategoryBreakdown from '@/components/CategoryBreakdown';
import Colors from '@/constants/Colors';
import { TimeRange } from '@/types';

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray[50],
  },
  header: {
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: Colors.gray[900],
    marginBottom: 16,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 16,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: Colors.gray[800],
    marginBottom: 16,
  },
  chartContainer: {
    alignItems: 'center',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  spacer: {
    height: 100, // Space for tab bar
  },
});

export default function ReportsScreen() {
  const { currency } = usePreferencesStore();

  const {
    selectedTimeRange,
    setTimeRange,
    getTotalIncome,
    getTotalExpenses,
    getCategoryTotals,
  } = useTransactionStore();

  // Get the data
  const income = getTotalIncome();
  const expenses = getTotalExpenses();
  const categoryTotals = getCategoryTotals();

  const handleRangeChange = (range: TimeRange) => {
    setTimeRange(range);
  };

  const chartData = {
    labels: ['Income', 'Expenses'],
    datasets: [
      {
        data: [income, expenses],
        colors: [
          (opacity = 1) => Colors.income,
          (opacity = 1) => Colors.expense,
        ],
      },
    ],
  };

  const chartConfig = {
    backgroundGradientFrom: Colors.white,
    backgroundGradientTo: Colors.white,
    decimalPlaces: 0,
    color: (opacity = 1) => Colors.primary,
    labelColor: (opacity = 1) => Colors.gray[700],
    style: {
      borderRadius: 16,
    },
    propsForLabels: {
      fontFamily: 'Inter-Medium',
    },
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Financial Reports</Text>
        </View>

        <TimeRangePicker
          selectedRange={selectedTimeRange}
          onRangeChange={handleRangeChange}
        />

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Income vs Expenses</Text>
          <View style={styles.chartContainer}>
            <BarChart
              data={chartData}
              width={screenWidth - 64}
              height={220}
              yAxisLabel={currency.symbol}
              yAxisSuffix=""
              chartConfig={chartConfig}
              style={styles.chart}
              fromZero
              showValuesOnTopOfBars
            />
          </View>
        </View>

        {expenses > 0 && (
          <CategoryBreakdown
            categoryTotals={categoryTotals}
            totalExpense={expenses}
          />
        )}

        <View style={styles.spacer} />
      </ScrollView>
    </SafeAreaView>
  );
}
