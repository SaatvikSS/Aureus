import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, RefreshControl } from 'react-native';
import { useTransactionStore } from '@/store/transactionStore';
import SummaryCard from '@/components/SummaryCard';
import CategoryBreakdown from '@/components/CategoryBreakdown';
import TransactionList from '@/components/TransactionList';
import TimeRangePicker from '@/components/TimeRangePicker';
import Colors from '@/constants/Colors';
import { TimeRange } from '@/types';

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
  greeting: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.gray[600],
    marginBottom: 4,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: Colors.gray[900],
    marginBottom: 16,
  },
  transactionsContainer: {
    flex: 1,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 16,
    marginTop: 16,
    paddingBottom: 100, // Space for tab bar
  },
});

export default function HomeScreen() {
  const [refreshing, setRefreshing] = React.useState(false);
  const {
    selectedTimeRange,
    setTimeRange,
    getTotalIncome,
    getTotalExpenses,
    getBalance,
    getCategoryTotals,
    getRecentTransactions,
  } = useTransactionStore();

  // Get the data
  const income = getTotalIncome();
  const expenses = getTotalExpenses();
  const balance = getBalance();
  const categoryTotals = getCategoryTotals();
  const recentTransactions = getRecentTransactions(5);

  const handleRangeChange = (range: TimeRange) => {
    setTimeRange(range);
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const getTimeRangeLabel = () => {
    switch (selectedTimeRange) {
      case 'week':
        return 'This Week';
      case 'month':
        return 'This Month';
      case 'quarter':
        return 'This Quarter';
      case 'year':
        return 'This Year';
      case 'all':
        return 'All Time';
      default:
        return 'This Month';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.greeting}>Hello</Text>
          <Text style={styles.title}>Financial Summary</Text>
        </View>

        <TimeRangePicker
          selectedRange={selectedTimeRange}
          onRangeChange={handleRangeChange}
        />

        <SummaryCard
          income={income}
          expenses={expenses}
          balance={balance}
          period={getTimeRangeLabel()}
        />

        {expenses > 0 && (
          <CategoryBreakdown
            categoryTotals={categoryTotals}
            totalExpense={expenses}
          />
        )}

        <View style={styles.transactionsContainer}>
          <TransactionList
            transactions={recentTransactions}
            emptyMessage="No recent transactions"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
