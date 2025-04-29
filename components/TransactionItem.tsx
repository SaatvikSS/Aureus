import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { format } from 'date-fns';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { Transaction } from '@/types';
import { getCategoryById } from '@/constants/Categories';
import { usePreferencesStore } from '@/store/preferencesStore';

interface TransactionItemProps {
  transaction: Transaction;
  onPress?: (transaction: Transaction) => void;
}

export default function TransactionItem({ transaction, onPress }: TransactionItemProps) {
  const { type, amount, description, date, category } = transaction;
  const { currency } = usePreferencesStore();
  
  const isIncome = type === 'income';
  const iconColor = isIncome ? Colors.income : Colors.expense;
  const amountColor = isIncome ? Colors.income : Colors.expense;
  
  const formattedDate = format(date, 'MMM dd');
  const categoryInfo = category ? getCategoryById(category) : null;
  
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress && onPress(transaction)}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: iconColor + '15' }]}>
        {isIncome ? (
          <ArrowUpRight color={iconColor} size={18} />
        ) : (
          <ArrowDownRight color={iconColor} size={18} />
        )}
      </View>
      
      <View style={styles.details}>
        <Text style={styles.description} numberOfLines={1}>
          {description}
        </Text>
        
        <View style={styles.metaContainer}>
          <Text style={styles.date}>{formattedDate}</Text>
          
          {categoryInfo && !isIncome && (
            <View style={styles.categoryContainer}>
              <View 
                style={[
                  styles.categoryDot, 
                  { backgroundColor: categoryInfo.color }
                ]} 
              />
              <Text style={styles.categoryText}>{categoryInfo.name}</Text>
            </View>
          )}
        </View>
      </View>
      
      <Text style={[styles.amount, { color: amountColor }]}>
        {isIncome ? '+' : '-'}{currency.symbol}{amount.toFixed(2)}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: Colors.white,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  details: {
    flex: 1,
    justifyContent: 'center',
  },
  description: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: Colors.gray[800],
    marginBottom: 4,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  date: {
    fontSize: 13,
    color: Colors.gray[500],
    fontFamily: 'Inter-Regular',
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  categoryDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  categoryText: {
    fontSize: 13,
    color: Colors.gray[500],
    fontFamily: 'Inter-Regular',
  },
  amount: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    paddingLeft: 8,
  },
});