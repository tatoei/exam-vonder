import { useState, useEffect } from 'react';
import { TransactionForm } from './components/TransactionForm';
import { TransactionList } from './components/TransactionList';
import { Summary } from './components/Summary';

const API_URL = 'http://localhost:3000/api';

interface Transaction {
    _id: string;
    type: 'income' | 'expense';
    amount: number;
    description: string;
    date: string;
}

interface SummaryData {
    totalIncome: number;
    totalExpense: number;
    balance: number;
}

function App() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [summary, setSummary] = useState<SummaryData>({
        totalIncome: 0,
        totalExpense: 0,
        balance: 0
    });

    const fetchTransactions = async () => {
        try {
            const response = await fetch(`${API_URL}/transactions`);
            const data = await response.json();
            setTransactions(data);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        }
    };

    const fetchSummary = async () => {
        try {
            const response = await fetch(`${API_URL}/transactions/summary`);
            const data = await response.json();
            setSummary(data);
        } catch (error) {
            console.error('Error fetching summary:', error);
        }
    };

    useEffect(() => {
        fetchTransactions();
        fetchSummary();
    }, []);

    const handleAddTransaction = async (transaction: Omit<Transaction, '_id'>) => {
        try {
            const response = await fetch(`${API_URL}/transactions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(transaction),
            });
            const data = await response.json();
            setTransactions([data, ...transactions]);
            fetchSummary();
        } catch (error) {
            console.error('Error adding transaction:', error);
        }
    };

    const handleDeleteTransaction = async (id: string) => {
        try {
            await fetch(`${API_URL}/transactions/${id}`, {
                method: 'DELETE',
            });
            setTransactions(transactions.filter(t => t._id !== id));
            fetchSummary();
        } catch (error) {
            console.error('Error deleting transaction:', error);
        }
    };

    const handleSearch = async (query: { startDate?: string; endDate?: string; type?: string }) => {
        try {
            const params = new URLSearchParams();
            if (query.startDate) params.append('startDate', query.startDate);
            if (query.endDate) params.append('endDate', query.endDate);
            if (query.type) params.append('type', query.type);

            const response = await fetch(`${API_URL}/transactions/search?${params}`);
            const data = await response.json();
            setTransactions(data);
        } catch (error) {
            console.error('Error searching transactions:', error);
        }
    };

    return (
        <div className="container mx-auto p-4 space-y-8">
            <h1 className="text-3xl font-bold text-center">Expense Tracker</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Add New Transaction</h2>
                    <TransactionForm onSubmit={handleAddTransaction} />
                </div>

                <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Summary</h2>
                    <Summary
                        totalIncome={summary.totalIncome}
                        totalExpense={summary.totalExpense}
                        balance={summary.balance}
                    />
                </div>
            </div>

            <div className="space-y-4">
                <h2 className="text-xl font-semibold">Transactions</h2>
                <TransactionList
                    transactions={transactions}
                    onDelete={handleDeleteTransaction}
                    onSearch={handleSearch}
                />
            </div>
        </div>
    );
}

export default App;
