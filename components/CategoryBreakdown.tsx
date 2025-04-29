import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { usePreferencesStore } from '@/store/preferencesStore';
import { CategoryTotal } from '@/types';
import Colors from '@/constants/Colors';
import { getCategoryById } from '@/constants/Categories';
import { Dimensions } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

const screenWidth = Dimensions.get('window').width;

interface CategoryBreakdownProps {
  categoryTotals: CategoryTotal[];
  totalExpense: number;
}

export default function CategoryBreakdown({ categoryTotals, totalExpense }: CategoryBreakdownProps) {
  const { currency } = usePreferencesStore();
  if (categoryTotals.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No expense data available</Text>
      </View>
    );
  }

  const chartData = categoryTotals.map(({ category, amount, percentage, color }) => {
    const categoryInfo = getCategoryById(category);
    return {
      name: categoryInfo.name,
      amount,
      percentage,
      color,
      legendFontColor: Colors.gray[700],
      legendFontSize: 12,
    };
  });

  return (
    <Animated.View
      style={styles.container}
      entering={FadeIn.duration(600).delay(200)}
    >
      <Text style={styles.title}>Expense Breakdown</Text>
      
      <View style={styles.chartContainer}>
        <PieChart
          data={chartData}
          width={screenWidth - 32}
          height={180}
          chartConfig={{
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          accessor="amount"
          backgroundColor="transparent"
          paddingLeft="0"
          absolute
          hasLegend={false}
        />
      </View>
      
      <ScrollView style={styles.legendContainer}>
        {categoryTotals.map((item) => {
          const categoryInfo = getCategoryById(item.category);
          return (
            <View key={item.category} style={styles.legendItem}>
              <View style={styles.legendLeft}>
                <View 
                  style={[styles.colorDot, { backgroundColor: item.color }]} 
                />
                <Text style={styles.categoryName}>{categoryInfo.name}</Text>
              </View>
              
              <View style={styles.legendRight}>
                <Text style={styles.categoryAmount}>{currency.symbol}{item.amount.toFixed(2)}</Text>
                <Text style={styles.categoryPercentage}>
                  {item.percentage.toFixed(1)}%
                </Text>
              </View>
            </View>
          );
        })}
      </ScrollView>
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
  title: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: Colors.gray[800],
    marginBottom: 16,
  },
  chartContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  legendContainer: {
    maxHeight: 200,
  },
  legendItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[100],
  },
  legendLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  categoryName: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.gray[700],
  },
  legendRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryAmount: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.gray[800],
    marginRight: 8,
  },
  categoryPercentage: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.gray[500],
    width: 44,
    textAlign: 'right',
  },
  emptyContainer: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.gray[500],
  },
});