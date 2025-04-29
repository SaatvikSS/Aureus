import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format, startOfMonth, endOfMonth, subMonths, parseISO } from 'date-fns';
import { Transaction, TimeRange, DateRange, CategoryTotal } from '@/types';
import { defaultCategories } from '@/constants/Categories';
import Colors from '@/constants/Colors';

interface TransactionState {
  transactions: Transaction[];
  dateRange: DateRange;
  selectedTimeRange: TimeRange;
  
  addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  clearTransactions: () => void;
  
  setDateRange: (range: DateRange) => void;
  setTimeRange: (timeRange: TimeRange) => void;
  
  getTotalIncome: () => number;
  getTotalExpenses: () => number;
  getBalance: () => number;
  getCategoryTotals: () => CategoryTotal[];
  getTransactionsInRange: () => Transaction[];
  getRecentTransactions: (limit?: number) => Transaction[];
}

// Calculate default date range (current month)
const today = new Date();
const defaultStartDate = startOfMonth(today);
const defaultEndDate = endOfMonth(today);

// Initialize store with test data for development
const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'income',
    amount: 5000,
    description: 'Salary',
    date: new Date(2025, 3, 15),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    type: 'expense',
    amount: 500,
    description: 'Groceries',
    category: 'food',
    date: new Date(2025, 3, 18),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    type: 'expense',
    amount: 1200,
    description: 'Rent',
    category: 'housing',
    date: new Date(2025, 3, 1),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '4',
    type: 'expense',
    amount: 200,
    description: 'Internet bill',
    category: 'utilities',
    date: new Date(2025, 3, 10),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '5',
    type: 'expense',
    amount: 150,
    description: 'Movie and dinner',
    category: 'entertainment',
    date: new Date(2025, 3, 20),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '6',
    type: 'income',
    amount: 1000,
    description: 'Freelance project',
    date: new Date(2025, 3, 22),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const useTransactionStore = create<TransactionState>()(
  persist(
    (set, get) => ({
      transactions: mockTransactions,
      dateRange: {
        startDate: defaultStartDate,
        endDate: defaultEndDate,
      },
      selectedTimeRange: 'month',
      
      addTransaction: (transactionData) => {
        const newTransaction: Transaction = {
          id: Math.random().toString(36).substr(2, 9),
          ...transactionData,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        set((state) => ({
          transactions: [newTransaction, ...state.transactions],
        }));
      },
      
      updateTransaction: (id, updatedData) => {
        set((state) => ({
          transactions: state.transactions.map((transaction) => 
            transaction.id === id 
              ? { ...transaction, ...updatedData, updatedAt: new Date() } 
              : transaction
          ),
        }));
      },
      
      deleteTransaction: (id) => {
        set((state) => ({
          transactions: state.transactions.filter((transaction) => transaction.id !== id),
        }));
      },

      clearTransactions: () => {
        set({ transactions: [] });
      },
      
      setDateRange: (range) => {
        set({ dateRange: range });
      },
      
      setTimeRange: (timeRange) => {
        let startDate, endDate;
        const today = new Date();
        
        switch (timeRange) {
          case 'week':
            startDate = new Date(today);
            startDate.setDate(today.getDate() - 7);
            endDate = today;
            break;
          case 'month':
            startDate = startOfMonth(today);
            endDate = endOfMonth(today);
            break;
          case 'quarter':
            startDate = new Date(today);
            startDate.setMonth(today.getMonth() - 3);
            endDate = today;
            break;
          case 'year':
            startDate = new Date(today);
            startDate.setFullYear(today.getFullYear() - 1);
            endDate = today;
            break;
          case 'all':
            startDate = new Date(0); // beginning of time
            endDate = today;
            break;
          default:
            startDate = startOfMonth(today);
            endDate = endOfMonth(today);
        }
        
        set({ 
          selectedTimeRange: timeRange,
          dateRange: { startDate, endDate },
        });
      },
      
      getTotalIncome: () => {
        const { startDate, endDate } = get().dateRange;
        return get().transactions
          .filter((t) => t.type === 'income' && t.date >= startDate && t.date <= endDate)
          .reduce((sum, t) => sum + t.amount, 0);
      },
      
      getTotalExpenses: () => {
        const { startDate, endDate } = get().dateRange;
        return get().transactions
          .filter((t) => t.type === 'expense' && t.date >= startDate && t.date <= endDate)
          .reduce((sum, t) => sum + t.amount, 0);
      },
      
      getBalance: () => {
        return get().getTotalIncome() - get().getTotalExpenses();
      },
      
      getCategoryTotals: () => {
        const { startDate, endDate } = get().dateRange;
        const expenseTransactions = get().transactions
          .filter((t) => t.type === 'expense' && t.date >= startDate && t.date <= endDate);
        
        const totalExpense = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);
        
        const categoryMap = new Map<string, number>();
        
        // Accumulate expenses by category
        expenseTransactions.forEach((transaction) => {
          const category = transaction.category || 'other';
          const currentAmount = categoryMap.get(category) || 0;
          categoryMap.set(category, currentAmount + transaction.amount);
        });
        
        // Convert to array of category totals
        const categoryTotals: CategoryTotal[] = Array.from(categoryMap.entries())
          .map(([category, amount]) => {
            const defaultCategory = defaultCategories.find(cat => cat.id === category);
            const color = defaultCategory?.color || Colors.gray[500];
            
            return {
              category,
              amount,
              percentage: totalExpense > 0 ? (amount / totalExpense) * 100 : 0,
              color,
            };
          })
          .sort((a, b) => b.amount - a.amount);
        
        return categoryTotals;
      },
      
      getTransactionsInRange: () => {
        const { startDate, endDate } = get().dateRange;
        return get().transactions
          .filter((t) => t.date >= startDate && t.date <= endDate)
          .sort((a, b) => b.date.getTime() - a.date.getTime());
      },
      
      getRecentTransactions: (limit = 5) => {
        return [...get().transactions]
          .sort((a, b) => b.date.getTime() - a.date.getTime())
          .slice(0, limit);
      },
    }),
    {
      name: 'transactions-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);