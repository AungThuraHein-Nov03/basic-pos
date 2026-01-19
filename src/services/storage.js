import productsData from '../assets/pos_item.json';

const STORAGE_KEY = 'pos_transactions';

export const TransactionService = {
    // Get all transactions
    getTransactions: () => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Failed to load transactions', error);
            return [];
        }
    },

    // Add a new transaction
    addTransaction: (transaction) => {
        try {
            const transactions = TransactionService.getTransactions();
            const newTransaction = {
                id: Date.now().toString(),
                timestamp: new Date().toISOString(),
                ...transaction,
            };
            transactions.unshift(newTransaction);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
            return newTransaction;
        } catch (error) {
            console.error('Failed to save transaction', error);
            return null;
        }
    },

    // Clear all transactions
    clearTransactions: () => {
        localStorage.removeItem(STORAGE_KEY);
    },

    // Get products list
    getProducts: () => {
        return productsData;
    }
};
