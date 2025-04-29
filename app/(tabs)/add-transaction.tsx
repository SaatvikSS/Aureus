import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { ArrowUpRight, ArrowDownRight, ChevronDown, Check } from 'lucide-react-native';
import { useTransactionStore } from '@/store/transactionStore';
import { defaultCategories } from '@/constants/Categories';
import Colors from '@/constants/Colors';
import { Transaction, TransactionType } from '@/types';
import { useRouter } from 'expo-router';
import { usePreferencesStore } from '@/store/preferencesStore';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';

export default function AddTransactionScreen() {
  const { currency } = usePreferencesStore();
  const router = useRouter();
  const { addTransaction } = useTransactionStore();
  
  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [showCategories, setShowCategories] = useState(false);

  const handleTypeSwitch = (newType: TransactionType) => {
    setType(newType);
    if (newType === 'income') {
      setCategory('');
    }
  };

  const handleCategorySelect = (categoryId: string) => {
    setCategory(categoryId);
    setShowCategories(false);
  };

  const handleSubmit = () => {
    if (!amount || !description) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (type === 'expense' && !category) {
      Alert.alert('Error', 'Please select a category for the expense');
      return;
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    const newTransaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'> = {
      type,
      amount: numericAmount,
      description,
      date: new Date(),
      ...(type === 'expense' && { category }),
    };

    addTransaction(newTransaction);

    // Reset form
    setAmount('');
    setDescription('');
    setCategory('');
    
    // Show success message and navigate to home
    Alert.alert(
      'Success', 
      `Your ${type} has been added successfully!`,
      [
        { 
          text: 'OK', 
          onPress: () => router.push('/') 
        }
      ]
    );
  };

  const selectedCategory = defaultCategories.find(cat => cat.id === category);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={80}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Animated.View 
            style={styles.header}
            entering={FadeIn.duration(400)}
          >
            <Text style={styles.title}>Add Transaction</Text>
          </Animated.View>

          <Animated.View 
            style={styles.form}
            entering={FadeIn.duration(600).delay(100)}
          >
            <View style={styles.typeSelector}>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  type === 'income' && styles.typeButtonActive,
                ]}
                onPress={() => handleTypeSwitch('income')}
              >
                <ArrowUpRight
                  size={18}
                  color={type === 'income' ? Colors.white : Colors.success}
                />
                <Text
                  style={[
                    styles.typeText,
                    type === 'income' && styles.typeTextActive,
                  ]}
                >
                  Income
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.typeButton,
                  type === 'expense' && styles.typeButtonActiveExpense,
                ]}
                onPress={() => handleTypeSwitch('expense')}
              >
                <ArrowDownRight
                  size={18}
                  color={type === 'expense' ? Colors.white : Colors.expense}
                />
                <Text
                  style={[
                    styles.typeText,
                    type === 'expense' && styles.typeTextActive,
                  ]}
                >
                  Expense
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.amountContainer}>
              <Text style={styles.currencySymbol}>{currency.symbol}</Text>
              <TextInput
                style={styles.amountInput}
                value={amount}
                onChangeText={setAmount}
                placeholder="0.00"
                keyboardType="decimal-pad"
                placeholderTextColor={Colors.gray[400]}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Description</Text>
              <TextInput
                style={styles.textInput}
                value={description}
                onChangeText={setDescription}
                placeholder="What was this for?"
                placeholderTextColor={Colors.gray[400]}
              />
            </View>

            {type === 'expense' && (
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Category</Text>
                <TouchableOpacity
                  style={styles.categorySelector}
                  onPress={() => setShowCategories(!showCategories)}
                >
                  {selectedCategory ? (
                    <View style={styles.selectedCategory}>
                      <View
                        style={[
                          styles.categoryDot,
                          { backgroundColor: selectedCategory.color },
                        ]}
                      />
                      <Text style={styles.categoryText}>
                        {selectedCategory.name}
                      </Text>
                    </View>
                  ) : (
                    <Text style={styles.placeholderText}>Select a category</Text>
                  )}
                  <ChevronDown size={16} color={Colors.gray[500]} />
                </TouchableOpacity>

                {showCategories && (
                  <Animated.View 
                    style={styles.categoriesDropdown}
                    entering={SlideInDown.duration(300)}
                  >
                    <ScrollView style={styles.categoriesList}>
                      {defaultCategories.map((cat) => (
                        <TouchableOpacity
                          key={cat.id}
                          style={styles.categoryItem}
                          onPress={() => handleCategorySelect(cat.id)}
                        >
                          <View style={styles.categoryItemLeft}>
                            <View
                              style={[
                                styles.categoryDot,
                                { backgroundColor: cat.color },
                              ]}
                            />
                            <Text style={styles.categoryItemText}>
                              {cat.name}
                            </Text>
                          </View>
                          {category === cat.id && (
                            <Check size={16} color={Colors.primary} />
                          )}
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </Animated.View>
                )}
              </View>
            )}

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>Add Transaction</Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray[50],
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100, // Extra space for tab bar
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
  form: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    margin: 16,
    padding: 16,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  typeSelector: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  typeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: Colors.gray[100],
    flex: 1,
    marginHorizontal: 4,
  },
  typeButtonActive: {
    backgroundColor: Colors.success,
  },
  typeButtonActiveExpense: {
    backgroundColor: Colors.expense,
  },
  typeText: {
    marginLeft: 8,
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.gray[700],
  },
  typeTextActive: {
    color: Colors.white,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
    paddingBottom: 8,
  },
  currencySymbol: {
    fontSize: 24,
    fontFamily: 'Inter-Medium',
    color: Colors.gray[700],
    marginRight: 4,
  },
  amountInput: {
    flex: 1,
    fontSize: 32,
    fontFamily: 'Inter-SemiBold',
    color: Colors.gray[800],
    padding: 0,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: Colors.gray[700],
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: Colors.gray[200],
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.gray[800],
  },
  categorySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: Colors.gray[200],
    borderRadius: 8,
    padding: 12,
  },
  selectedCategory: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.gray[800],
  },
  placeholderText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.gray[400],
  },
  categoriesDropdown: {
    borderWidth: 1,
    borderColor: Colors.gray[200],
    borderRadius: 8,
    marginTop: 8,
    backgroundColor: Colors.white,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    maxHeight: 200,
  },
  categoriesList: {
    padding: 8,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[100],
  },
  categoryItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryItemText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.gray[800],
  },
  submitButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
});