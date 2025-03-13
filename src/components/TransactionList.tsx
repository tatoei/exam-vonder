import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface Transaction {
    _id: string;
    type: 'income' | 'expense';
    amount: number;
    description: string;
    date: string;
}

interface TransactionListProps {
    transactions: Transaction[];
    onDelete: (id: string) => void;
    onSearch: (query: { startDate?: string; endDate?: string; type?: string }) => void;
}

export function TransactionList({ transactions, onDelete, onSearch }: TransactionListProps) {
    const [searchParams, setSearchParams] = useState({
        startDate: '',
        endDate: '',
        type: ''
    });

    const handleSearch = () => {
        onSearch(searchParams);
    };

    return (
        <div className="space-y-4">
            <div className="flex gap-4">
                <Input
                    type="date"
                    placeholder="Start Date"
                    value={searchParams.startDate}
                    onChange={(e) => setSearchParams({ ...searchParams, startDate: e.target.value })}
                />
                <Input
                    type="date"
                    placeholder="End Date"
                    value={searchParams.endDate}
                    onChange={(e) => setSearchParams({ ...searchParams, endDate: e.target.value })}
                />
                <Select
                    value={searchParams.type}
                    onValueChange={(value) => setSearchParams({ ...searchParams, type: value })}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="">All</SelectItem>
                        <SelectItem value="income">Income</SelectItem>
                        <SelectItem value="expense">Expense</SelectItem>
                    </SelectContent>
                </Select>
                <Button onClick={handleSearch}>Search</Button>
            </div>

            <div className="space-y-2">
                {transactions.map((transaction) => (
                    <div
                        key={transaction._id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                    >
                        <div>
                            <p className="font-medium">{transaction.description}</p>
                            <p className="text-sm text-gray-500">
                                {new Date(transaction.date).toLocaleDateString()}
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <p className={`font-bold ${transaction.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
                                {transaction.type === 'income' ? '+' : '-'}฿{transaction.amount.toLocaleString()}
                            </p>
                            <Button
                                variant="danger"
                                size="sm"
                                onClick={() => onDelete(transaction._id)}
                            >
                                Delete
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
} 