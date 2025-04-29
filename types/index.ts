export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  description: string;
  date: Date;
  category?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  isDefault?: boolean;
}

export interface MonthlyTotal {
  month: string;
  income: number;
  expense: number;
}

export type TimeRange = 'week' | 'month' | 'quarter' | 'year' | 'all';

export type DateRange = {
  startDate: Date;
  endDate: Date;
};

export interface CategoryTotal {
  category: string;
  amount: number;
  percentage: number;
  color: string;
}