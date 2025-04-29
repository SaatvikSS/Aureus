import React from 'react';
import { View, Text, StyleSheet, SectionList } from 'react-native';
import { format } from 'date-fns';
import TransactionItem from './TransactionItem';
import { Transaction } from '@/types';
import Colors from '@/constants/Colors';
import Animated, { FadeIn } from 'react-native-reanimated';

interface TransactionListProps {
  transactions: Transaction[];
  onTransactionPress?: (transaction: Transaction) => void;
  emptyMessage?: string;
}

// Helper function to group transactions by date
const groupTransactionsByDate = (transactions: Transaction[]) => {
  const grouped = transactions.reduce((acc, transaction) => {
    const dateString = format(transaction.date, 'yyyy-MM-dd');
    
    if (!acc[dateString]) {
      acc[dateString] = {
        title: format(transaction.date, 'EEEE, MMMM d'),
        data: [],
      };
    }
    
    acc[dateString].data.push(transaction);
    return acc;
  }, {} as Record<string, { title: string; data: Transaction[] }>);
  
  return Object.values(grouped);
};

export default function TransactionList({
  transactions,
  onTransactionPress,
  emptyMessage = 'No transactions found',
}: TransactionListProps) {
  const sections = groupTransactionsByDate(transactions);
  
  if (transactions.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>{emptyMessage}</Text>
      </View>
    );
  }
  
  return (
    <Animated.View 
      style={styles.container}
      entering={FadeIn.duration(400).delay(100)}
    >
      <Text style={styles.title}>Transactions</Text>
      
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TransactionItem
            transaction={item}
            onPress={onTransactionPress}
          />
        )}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionHeader}>{title}</Text>
        )}
        stickySectionHeadersEnabled={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    paddingBottom: 100, // Extra padding for tab bar
  },
  title: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: Colors.gray[800],
    marginBottom: 16,
  },
  sectionHeader: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: Colors.gray[500],
    marginTop: 16,
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  listContent: {
    paddingBottom: 16,
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.gray[500],
  },
});