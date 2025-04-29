import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ArrowUpRight, ArrowDownRight, DollarSign } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import Colors from '@/constants/Colors';
import { usePreferencesStore } from '@/store/preferencesStore';

interface SummaryCardProps {
  income: number;
  expenses: number;
  balance: number;
  period?: string;
}

export default function SummaryCard({ 
  income, 
  expenses, 
  balance,
  period = 'This Month'
}: SummaryCardProps) {
  const { currency } = usePreferencesStore();
  
  return (
    <Animated.View 
      style={styles.container}
      entering={FadeInUp.duration(400).springify()}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Summary</Text>
        <Text style={styles.period}>{period}</Text>
      </View>
      
      <View style={styles.balanceContainer}>
        <View style={styles.balanceIconContainer}>
          <Text style={styles.balanceSymbol}>{currency.symbol}</Text>
        </View>
        <View>
          <Text style={styles.balanceLabel}>Balance</Text>
          <Text style={styles.balanceAmount}>{currency.symbol}{balance.toFixed(2)}</Text>
        </View>
      </View>
      
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <View style={[styles.iconContainer, styles.incomeIcon]}>
            <ArrowUpRight size={14} color={Colors.income} />
          </View>
          <View>
            <Text style={styles.statLabel}>Income</Text>
            <Text style={[styles.statAmount, styles.incomeText]}>
              {currency.symbol}{income.toFixed(2)}
            </Text>
          </View>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.statItem}>
          <View style={[styles.iconContainer, styles.expenseIcon]}>
            <ArrowDownRight size={14} color={Colors.expense} />
          </View>
          <View>
            <Text style={styles.statLabel}>Expenses</Text>
            <Text style={[styles.statAmount, styles.expenseText]}>
              {currency.symbol}{expenses.toFixed(2)}
            </Text>
          </View>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: Colors.gray[800],
  },
  period: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.gray[500],
  },
  balanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray[50],
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  balanceIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  balanceSymbol: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: 'Inter-Bold',
  },
  balanceLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.gray[500],
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: Colors.gray[900],
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.gray[50],
    borderRadius: 12,
    padding: 16,
  },
  statItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  incomeIcon: {
    backgroundColor: Colors.income + '15',
  },
  expenseIcon: {
    backgroundColor: Colors.expense + '15',
  },
  statLabel: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: Colors.gray[500],
    marginBottom: 4,
  },
  statAmount: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  incomeText: {
    color: Colors.income,
  },
  expenseText: {
    color: Colors.expense,
  },
  divider: {
    width: 1,
    height: '100%',
    backgroundColor: Colors.gray[200],
    marginHorizontal: 16,
  },
});