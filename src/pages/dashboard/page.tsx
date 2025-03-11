import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import React, { useState, useEffect } from 'react';
import { CiBitcoin } from "react-icons/ci";

// Types
interface Transaction {
  id: string;
  date: string;
  description: string;
  income: number;
  expense: number;
  balance: number;
}

const DashboardPage: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [income, setIncome] = useState<number>(5000);
  const [expenses, setExpenses] = useState<number>(1200);
  const [description, setDescription] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [transactionType, setTransactionType] = useState<'income' | 'expense'>('income');
  const [userName, setUserName] = useState<string>('Sararawee');

  // Calculate balance
  const balance = income - expenses;

  // Add new transaction
  const handleAddTransaction = () => {
    if (!description || !amount || isNaN(Number(amount))) {
      alert('Please enter a valid description and amount.');
      return;
    }

    const amountNumber = Number(amount);
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      description,
      income: transactionType === 'income' ? amountNumber : 0,
      expense: transactionType === 'expense' ? amountNumber : 0,
      balance: transactionType === 'income' ? balance + amountNumber : balance - amountNumber,
    };

    setTransactions([...transactions, newTransaction]);

    // Update total income or expense
    if (transactionType === 'income') {
      setIncome(income + amountNumber);
    } else {
      setExpenses(expenses + amountNumber);
    }

    // Reset form
    setDescription('');
    setAmount('');
  };

  return (
    <div className="min-h-screen p-4">
      {/* Header */}
      <div className="flex justify-end items-center mb-8">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-gray-800 text-white flex items-center justify-center mr-2">
            <span>S</span>
          </div>
          <span className="text-lg font-semibold mr-2">Welcome {userName}</span>
        </div>
        <Button variant="danger" size="default">
          Logout
        </Button>
      </div>

      {/* Card */}
      <div className='flex gap-4 justify-center'>
        <Card className="w-[260px] bg-[#00A86B] p-4 rounded-2xl shadow-lg">
          <div className="flex items-center space-x-4">
            <div className="bg-white h-10 w-10 rounded-lg flex items-center justify-center shadow-md">
              <CiBitcoin className="text-[#00A86B] text-2xl" />
            </div>
            <CardHeader className="p-0">
              <CardTitle className="text-white text-lg font-semibold">Income</CardTitle>
              <CardDescription className="text-white text-2xl font-bold">$</CardDescription>
            </CardHeader>
          </div>
        </Card>
        <Card className="w-[260px] bg-red-500 p-4 rounded-2xl shadow-lg">
          <div className="flex items-center space-x-4">
            <div className="bg-white h-10 w-10 rounded-lg flex items-center justify-center shadow-md">
              <CiBitcoin className="text-red-500 text-2xl" />
            </div>
            <CardHeader className="p-0">
              <CardTitle className="text-white text-lg font-semibold">Expenses</CardTitle>
              <CardDescription className="text-white text-2xl font-bold">$</CardDescription>
            </CardHeader>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;