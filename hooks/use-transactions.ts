import { useState, useEffect, useCallback, useMemo } from 'react';
import { Transaction } from '../types/transaction';
import { storage } from '../utils/storage';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, startOfYear, endOfYear, parseISO, isWithinInterval } from 'date-fns';

export type TimeRange = 'week' | 'month' | 'year';

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  // Load transactions on mount
  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = useCallback(async () => {
    setLoading(true);
    const data = await storage.getTransactions();
    setTransactions(data);
    setLoading(false);
  }, []);

  const addTransaction = useCallback(async (transaction: Omit<Transaction, 'id' | 'createdAt'>) => {
    const newTransaction = await storage.addTransaction(transaction);
    setTransactions((prev) => [newTransaction, ...prev]);
    return newTransaction;
  }, []);

  const updateTransaction = useCallback(async (id: string, updates: Partial<Transaction>) => {
    await storage.updateTransaction(id, updates);
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
  }, []);

  const deleteTransaction = useCallback(async (id: string) => {
    await storage.deleteTransaction(id);
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const getTransactionById = useCallback((id: string) => {
    return transactions.find((t) => t.id === id) || null;
  }, [transactions]);

  // Calculate totals for a time range
  const calculateTotals = useCallback((range: TimeRange) => {
    const now = new Date();
    let start: Date;
    let end: Date;

    switch (range) {
      case 'week':
        start = startOfWeek(now, { weekStartsOn: 1 });
        end = endOfWeek(now, { weekStartsOn: 1 });
        break;
      case 'month':
        start = startOfMonth(now);
        end = endOfMonth(now);
        break;
      case 'year':
        start = startOfYear(now);
        end = endOfYear(now);
        break;
    }

    const filtered = transactions.filter((t) => {
      const date = parseISO(t.date);
      return isWithinInterval(date, { start, end });
    });

    const income = filtered
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const expense = filtered
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    return { income, expense, balance: income - expense };
  }, [transactions]);

  // Get transactions by date range
  const getTransactionsByRange = useCallback((range: TimeRange) => {
    const now = new Date();
    let start: Date;
    let end: Date;

    switch (range) {
      case 'week':
        start = startOfWeek(now, { weekStartsOn: 1 });
        end = endOfWeek(now, { weekStartsOn: 1 });
        break;
      case 'month':
        start = startOfMonth(now);
        end = endOfMonth(now);
        break;
      case 'year':
        start = startOfYear(now);
        end = endOfYear(now);
        break;
    }

    return transactions.filter((t) => {
      const date = parseISO(t.date);
      return isWithinInterval(date, { start, end });
    });
  }, [transactions]);

  // Group transactions by category
  const getGroupedByCategory = useCallback((range: TimeRange) => {
    const filtered = getTransactionsByRange(range);
    const groups: Record<string, { income: number; expense: number }> = {};

    filtered.forEach((t) => {
      if (!groups[t.category]) {
        groups[t.category] = { income: 0, expense: 0 };
      }
      if (t.type === 'income') {
        groups[t.category].income += t.amount;
      } else {
        groups[t.category].expense += t.amount;
      }
    });

    return groups;
  }, [getTransactionsByRange]);

  return {
    transactions,
    loading,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getTransactionById,
    calculateTotals,
    getTransactionsByRange,
    getGroupedByCategory,
    refresh: loadTransactions,
  };
}