import AsyncStorage from '@react-native-async-storage/async-storage';
import { Transaction } from '../types/transaction';

const TRANSACTIONS_KEY = '@accounting_transactions';

export const storage = {
  // Get all transactions
  async getTransactions(): Promise<Transaction[]> {
    try {
      const data = await AsyncStorage.getItem(TRANSACTIONS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to get transactions:', error);
      return [];
    }
  },

  // Save all transactions
  async saveTransactions(transactions: Transaction[]): Promise<void> {
    try {
      await AsyncStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
    } catch (error) {
      console.error('Failed to save transactions:', error);
      throw error;
    }
  },

  // Add a new transaction
  async addTransaction(transaction: Omit<Transaction, 'id' | 'createdAt'>): Promise<Transaction> {
    const transactions = await this.getTransactions();
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
    };
    transactions.unshift(newTransaction);
    await this.saveTransactions(transactions);
    return newTransaction;
  },

  // Update a transaction
  async updateTransaction(id: string, updates: Partial<Transaction>): Promise<void> {
    const transactions = await this.getTransactions();
    const index = transactions.findIndex((t) => t.id === id);
    if (index !== -1) {
      transactions[index] = { ...transactions[index], ...updates };
      await this.saveTransactions(transactions);
    }
  },

  // Delete a transaction
  async deleteTransaction(id: string): Promise<void> {
    const transactions = await this.getTransactions();
    const filtered = transactions.filter((t) => t.id !== id);
    await this.saveTransactions(filtered);
  },

  // Get transaction by id
  async getTransactionById(id: string): Promise<Transaction | null> {
    const transactions = await this.getTransactions();
    return transactions.find((t) => t.id === id) || null;
  },

  // Clear all data
  async clearAll(): Promise<void> {
    await AsyncStorage.removeItem(TRANSACTIONS_KEY);
  },
};