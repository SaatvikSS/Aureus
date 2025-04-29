import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  SafeAreaView,
} from 'react-native';
import { X as XIcon, Check } from 'lucide-react-native';
import { currencies, Currency } from '@/constants/Currencies';
import Colors from '@/constants/Colors';

interface CurrencySelectorProps {
  visible: boolean;
  onClose: () => void;
  selectedCurrency: Currency;
  onSelect: (currency: Currency) => void;
}

export default function CurrencySelector({
  visible,
  onClose,
  selectedCurrency,
  onSelect,
}: CurrencySelectorProps) {
  const renderItem = ({ item }: { item: Currency }) => {
    const isSelected = item.code === selectedCurrency.code;
    
    return (
      <TouchableOpacity
        style={styles.currencyItem}
        onPress={() => {
          onSelect(item);
          onClose();
        }}
      >
        <View style={styles.currencyInfo}>
          <Text style={styles.currencySymbol}>{item.symbol}</Text>
          <View>
            <Text style={styles.currencyCode}>{item.code}</Text>
            <Text style={styles.currencyName}>{item.name}</Text>
          </View>
        </View>
        
        {isSelected && <Check size={20} color={Colors.primary} />}
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Select Currency</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <XIcon size={20} color={Colors.gray[600]} />
          </TouchableOpacity>
        </View>

        <FlatList
          data={currencies}
          renderItem={renderItem}
          keyExtractor={(item) => item.code}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
        />
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray[50],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
  },
  title: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: Colors.gray[900],
  },
  closeButton: {
    padding: 8,
  },
  list: {
    padding: 16,
  },
  currencyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: Colors.white,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  currencyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencySymbol: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: Colors.gray[700],
    marginRight: 12,
    width: 32,
    textAlign: 'center',
  },
  currencyCode: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: Colors.gray[900],
    marginBottom: 2,
  },
  currencyName: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.gray[500],
  },
});