import { Category } from '@/types';
import Colors from './Colors';

export const defaultCategories: Category[] = [
  {
    id: 'food',
    name: 'Food & Dining',
    icon: 'utensils',
    color: Colors.categories.food,
    isDefault: true,
  },
  {
    id: 'transportation',
    name: 'Transportation',
    icon: 'car',
    color: Colors.categories.transportation,
    isDefault: true,
  },
  {
    id: 'housing',
    name: 'Housing & Rent',
    icon: 'home',
    color: Colors.categories.housing,
    isDefault: true,
  },
  {
    id: 'utilities',
    name: 'Utilities',
    icon: 'bolt',
    color: Colors.categories.utilities,
    isDefault: true,
  },
  {
    id: 'entertainment',
    name: 'Entertainment',
    icon: 'film',
    color: Colors.categories.entertainment,
    isDefault: true,
  },
  {
    id: 'healthcare',
    name: 'Healthcare',
    icon: 'heart',
    color: Colors.categories.healthcare,
    isDefault: true,
  },
  {
    id: 'shopping',
    name: 'Shopping',
    icon: 'shopping-bag',
    color: Colors.categories.shopping,
    isDefault: true,
  },
  {
    id: 'education',
    name: 'Education',
    icon: 'book',
    color: Colors.categories.education,
    isDefault: true,
  },
  {
    id: 'personal',
    name: 'Personal Care',
    icon: 'user',
    color: Colors.categories.personal,
    isDefault: true,
  },
  {
    id: 'other',
    name: 'Other',
    icon: 'more-horizontal',
    color: Colors.categories.other,
    isDefault: true,
  },
];

export const getCategoryById = (id: string): Category => {
  return (
    defaultCategories.find((category) => category.id === id) || {
      id: 'other',
      name: 'Other',
      icon: 'more-horizontal',
      color: Colors.categories.other,
    }
  );
};

export const getCategoryIcon = (id: string): string => {
  const category = defaultCategories.find((category) => category.id === id);
  return category?.icon || 'more-horizontal';
};

export const getCategoryColor = (id: string): string => {
  const category = defaultCategories.find((category) => category.id === id);
  return category?.color || Colors.categories.other;
};