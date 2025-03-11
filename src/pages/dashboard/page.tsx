import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import React, { useState } from 'react';
import { CiBitcoin } from "react-icons/ci";
import * as XLSX from "xlsx";

// Types
interface Transaction {
  id: string;
  date: string;
  description: string;
  income: number;
  expense: number;
  balance: number;
}

const transactionData = [
  {
    date: "01/01/2025",
    item: "รายรับจากการขาย",
    income: "$500.00",
    expense: "$0.00",
    balance: "$500.00"
  },
  {
    date: "02/01/2025",
    item: "ค่าใช้จ่ายการซื้อสินค้า",
    income: "$0.00",
    expense: "$200.00",
    balance: "$300.00"
  }
];

const exportToExcel = () => {
  const ws = XLSX.utils.json_to_sheet(transactionData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Transactions");
  XLSX.writeFile(wb, "transactions.xlsx");
};

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
      {/* <div className='flex gap-4 justify-center'>
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
      </div> */}

      {/* Text */}
      <div className='mt-5 text-xl flex justify-center font-bold'>ระบบบันทึกบัญชี รายรับ - รายจ่าย</div>

      {/* Search and Select */}
      <div className="flex justify-center items-center space-x-4 mb-4 mt-5">
        <input
          type="text"
          placeholder="ค้นหา"
          className="border rounded p-2 h-10 w-[400px]"
        />
        <Select onValueChange={(value) => setTransactionType(value as 'income' | 'expense')}>
          <SelectTrigger className="w-[180px] h-10">
            <SelectValue placeholder="เลือกประเภท" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>ประเภท</SelectLabel>
              <SelectItem value="income">รายรับ</SelectItem>
              <SelectItem value="expense">รายจ่าย</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <input
          type="date"
          className="border rounded p-2 h-10"
        />
        <span>To</span>
        <input
          type="date"
          className="border rounded p-2 h-10"
        />
      </div>
      <hr className="w-3/4  border-gray-300 my-4 mx-auto" />

      {/* Button */}
      <div className="flex justify-end w-3/4 mx-auto">
        <Button variant="facebook" size="default">
          เพิ่มข้อมูลรายรับ - รายจ่าย
        </Button>
        <Button variant="black" size="default" className='ml-2' onClick={exportToExcel}>
          Export Excel
        </Button>
      </div>

      {/* Table */}
      <Table className='w-3/4 mx-auto mt-5'>
        <TableCaption>ตารางบันทึกรายรับ - รายจ่าย</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className='text-center'>วันที่</TableHead>
            <TableHead className='text-center'>รายการ</TableHead>
            <TableHead className='text-center'>รายรับ</TableHead>
            <TableHead className='text-center'>รายจ่าย</TableHead>
            <TableHead className='text-center'>คงเหลือ</TableHead>
            <TableHead className='text-center'>เครื่องมือ</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactionData.map((transaction, index) => (
            <TableRow key={index}>
              <TableCell className="text-center">{transaction.date}</TableCell>
              <TableCell className="text-center">{transaction.item}</TableCell>
              <TableCell className="text-center">{transaction.income}</TableCell>
              <TableCell className="text-center">{transaction.expense}</TableCell>
              <TableCell className="text-center">{transaction.balance}</TableCell>
              <TableCell className="text-center">
                <Button variant="danger" size="default">
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DashboardPage;