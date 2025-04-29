import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { TimeRange } from '@/types';
import Colors from '@/constants/Colors';

interface TimeRangePickerProps {
  selectedRange: TimeRange;
  onRangeChange: (range: TimeRange) => void;
}

const timeRanges: { value: TimeRange; label: string }[] = [
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
  { value: 'quarter', label: 'Quarter' },
  { value: 'year', label: 'Year' },
  { value: 'all', label: 'All Time' },
];

export default function TimeRangePicker({
  selectedRange,
  onRangeChange,
}: TimeRangePickerProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {timeRanges.map(({ value, label }) => (
        <TouchableOpacity
          key={value}
          style={[
            styles.rangeButton,
            selectedRange === value && styles.rangeButtonSelected,
          ]}
          onPress={() => onRangeChange(value)}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.rangeText,
              selectedRange === value && styles.rangeTextSelected,
            ]}
          >
            {label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  rangeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: Colors.gray[100],
  },
  rangeButtonSelected: {
    backgroundColor: Colors.primary,
  },
  rangeText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: Colors.gray[600],
  },
  rangeTextSelected: {
    color: Colors.white,
  },
});