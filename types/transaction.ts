// Transaction Types
export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  note?: string;
  date: string; // ISO date string YYYY-MM-DD
  createdAt: string; // ISO datetime string
}

export type TransactionType = 'income' | 'expense';

// Category configuration
export const EXPENSE_CATEGORIES = [
  '餐饮',
  '交通',
  '购物',
  '娱乐',
  '医疗',
  '教育',
  '居住',
  '其他',
] as const;

export const INCOME_CATEGORIES = [
  '工资',
  '奖金',
  '投资',
  '兼职',
  '其他',
] as const;

export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];
export type IncomeCategory = (typeof INCOME_CATEGORIES)[number];
export type Category = ExpenseCategory | IncomeCategory;

// Category icons mapping
export const CATEGORY_ICONS: Record<string, string> = {
  // Expense
  餐饮: 'restaurant',
  交通: 'car',
  购物: 'cart',
  娱乐: 'gamecontroller',
  医疗: 'cross.case',
  教育: 'book',
  居住: 'house',
  其他: 'ellipsis',
  // Income
  工资: 'briefcase',
  奖金: 'gift',
  投资: 'chart.line.uptrend.xyaxis',
  兼职: 'person.crop.circle.badge.clock',
};