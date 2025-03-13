import { Button } from '@/components/ui/button';
// import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import React, { useState, useEffect } from 'react';
// import { CiBitcoin } from "react-icons/ci";
import * as XLSX from "xlsx";
import { expenseApi } from '@/lib/api';
import { Expense } from '@/types';


// Types
interface Transaction {
  _id: string;
  date: string;
  item: string;
  income: string;
  expense: string;
  balance: string;
}

interface TransactionSummary {
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
  transactionCount: number;
  averageTransaction: number;
  lastTransactionDate: string;
}

const DashboardPage: React.FC = () => {
  const [transactionData, setTransactionData] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [open, setOpen] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    date: new Date().toISOString().split('T')[0],
    item: '',
    transactionType: 'income',
    amount: ''
  });
  const [userName] = useState<string>('Sararawee');
  const [summary, setSummary] = useState<TransactionSummary>({
    totalIncome: 0,
    totalExpense: 0,
    netBalance: 0,
    transactionCount: 0,
    averageTransaction: 0,
    lastTransactionDate: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Fetch transactions from API
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await expenseApi.getAll();
        const expenses = response.data.data;
        const transactions: Transaction[] = expenses.map((expense: Expense) => ({
          _id: expense._id,
          date: expense.date,
          item: expense.item,
          income: expense.transactionType === 'income' ? `฿${expense.amount}` : '฿0',
          expense: expense.transactionType === 'expense' ? `฿${expense.amount}` : '฿0',
          balance: `฿${expense.amount}`
        }));
        setTransactionData(transactions);
        setFilteredTransactions(transactions);
      } catch (err) {
        setError('Failed to fetch transactions');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // Filter transactions
  useEffect(() => {
    let filtered = [...transactionData];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(transaction =>
        transaction.item.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(transaction => {
        if (filterType === 'income') {
          return transaction.income !== '฿0';
        } else {
          return transaction.expense !== '฿0';
        }
      });
    }

    // Filter by date range
    if (startDate && endDate) {
      filtered = filtered.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        const start = new Date(startDate);
        const end = new Date(endDate);
        return transactionDate >= start && transactionDate <= end;
      });
    }

    setFilteredTransactions(filtered);
  }, [searchTerm, filterType, startDate, endDate, transactionData]);

  // Calculate summary data
  useEffect(() => {
    const calculateSummary = () => {
      let totalIncome = 0;
      let totalExpense = 0;
      const transactionCount = filteredTransactions.length;
      const lastTransactionDate = filteredTransactions.length > 0 ?
        filteredTransactions[filteredTransactions.length - 1].date : '';

      filteredTransactions.forEach(transaction => {
        totalIncome += parseFloat(transaction.income.replace('฿', '')) || 0;
        totalExpense += parseFloat(transaction.expense.replace('฿', '')) || 0;
      });

      const netBalance = totalIncome - totalExpense;
      const averageTransaction = transactionCount > 0 ?
        (totalIncome + totalExpense) / transactionCount : 0;

      setSummary({
        totalIncome,
        totalExpense,
        netBalance,
        transactionCount,
        averageTransaction,
        lastTransactionDate
      });
    };

    calculateSummary();
  }, [filteredTransactions]);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewTransaction({
      ...newTransaction,
      [name]: value
    });
  };

  // Handle transaction type change
  const handleTransactionTypeChange = (value: string) => {
    setNewTransaction({
      ...newTransaction,
      transactionType: value
    });
  };

  // Add new transaction
  const handleAddTransaction = async () => {
    if (!newTransaction.item || !newTransaction.amount || isNaN(Number(newTransaction.amount))) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วนและถูกต้อง');
      return;
    }

    try {
      const response = await expenseApi.create({
        date: newTransaction.date,
        item: newTransaction.item,
        transactionType: newTransaction.transactionType,
        amount: Number(newTransaction.amount)
      });

      const newExpense = response.data.data;
      const newTransactionData: Transaction = {
        _id: newExpense._id,
        date: newExpense.date,
        item: newExpense.item,
        income: newExpense.transactionType === 'income' ? `฿${newExpense.amount}` : '฿0',
        expense: newExpense.transactionType === 'expense' ? `฿${newExpense.amount}` : '฿0',
        balance: `฿${newExpense.amount}`
      };

      setTransactionData([...transactionData, newTransactionData]);

      // Reset form
      setNewTransaction({
        date: new Date().toISOString().split('T')[0],
        item: '',
        transactionType: 'income',
        amount: ''
      });

      // Close dialog
      setOpen(false);
    } catch (err) {
      alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
      console.error(err);
    }
  };

  // Delete transaction
  const handleDeleteTransaction = async (id: string) => {
    try {
      await expenseApi.delete(id);
      setTransactionData(transactionData.filter(transaction => transaction._id !== id));
    } catch (err) {
      alert('เกิดข้อผิดพลาดในการลบข้อมูล');
      console.error(err);
    }
  };

  const exportToExcel = () => {
    const dataForExport = filteredTransactions.map(({ _id, ...rest }) => rest);
    const ws = XLSX.utils.json_to_sheet(dataForExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Transactions");
    XLSX.writeFile(wb, "transactions.xlsx");
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

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

      {/* Text */}
      <div className='mt-5 text-xl flex justify-center font-bold'>ระบบบันทึกบัญชี รายรับ - รายจ่าย</div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-3/4 mx-auto mt-6">
        <Card className="bg-green-100 pb-2">
          <CardHeader>
            <CardTitle className="text-lg text-green-700">รายรับทั้งหมด</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <p className="text-2xl font-bold text-green-600">฿{summary.totalIncome.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card className="bg-red-100 pb-2">
          <CardHeader>
            <CardTitle className="text-lg text-red-700">รายจ่ายทั้งหมด</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <p className="text-2xl font-bold text-red-600">฿{summary.totalExpense.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card className="bg-blue-100 pb-2">
          <CardHeader>
            <CardTitle className="text-lg text-blue-700">คงเหลือสุทธิ </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <p className={`text-2xl font-bold ${summary.netBalance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
              ฿{summary.netBalance.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-purple-100 pb-2">
          <CardHeader>
            <CardTitle className="text-lg text-purple-700">จำนวนรายการ</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <p className="text-2xl font-bold text-purple-600">{summary.transactionCount}</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Select */}
      <div className="flex justify-center items-center space-x-4 mb-4 mt-5">
        <input
          type="text"
          placeholder="ค้นหา"
          className="border rounded p-2 h-10 w-[400px]"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Select value={filterType} onValueChange={(value) => setFilterType(value as 'all' | 'income' | 'expense')}>
          <SelectTrigger className="w-[180px] h-10">
            <SelectValue placeholder="เลือกประเภท" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>ประเภท</SelectLabel>
              <SelectItem value="all">ทั้งหมด</SelectItem>
              <SelectItem value="income">รายรับ</SelectItem>
              <SelectItem value="expense">รายจ่าย</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <input
          type="date"
          className="border rounded p-2 h-10"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <span>To</span>
        <input
          type="date"
          className="border rounded p-2 h-10"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>
      <hr className="w-3/4 border-gray-300 my-4 mx-auto" />

      {/* Button */}
      <div className="flex justify-end w-3/4 mx-auto">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="facebook" size="default">
              เพิ่มข้อมูลรายรับ - รายจ่าย
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>เพิ่มข้อมูลรายรับ - รายจ่าย</DialogTitle>
              <DialogDescription>
                กรอกข้อมูลรายรับหรือรายจ่ายที่ต้องการบันทึก
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="date" className="text-right">
                  วันที่
                </Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={newTransaction.date}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="item" className="text-right">
                  รายการ
                </Label>
                <Input
                  id="item"
                  name="item"
                  placeholder="รายละเอียดรายการ"
                  value={newTransaction.item}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4 ">
                <Label htmlFor="transactionType" className="text-right">
                  ประเภท
                </Label>
                <Select
                  value={newTransaction.transactionType}
                  onValueChange={handleTransactionTypeChange}
                >
                  <SelectTrigger className="col-span-3 w-full">
                    <SelectValue placeholder="เลือกประเภท" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="income">รายรับ</SelectItem>
                      <SelectItem value="expense">รายจ่าย</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="amount" className="text-right">
                  จำนวนเงิน
                </Label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  placeholder="0.00"
                  value={newTransaction.amount}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" variant="line" className='w-full' onClick={handleAddTransaction}>
                บันทึกข้อมูล
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
          {filteredTransactions.map((transaction) => (
            <TableRow key={transaction._id}>
              <TableCell className="text-center">{transaction.date}</TableCell>
              <TableCell className="text-center">{transaction.item}</TableCell>
              <TableCell className="text-center">{transaction.income}</TableCell>
              <TableCell className="text-center">{transaction.expense}</TableCell>
              <TableCell className="text-center">{transaction.balance}</TableCell>
              <TableCell className="text-center">
                <Button
                  variant="danger"
                  size="default"
                  onClick={() => handleDeleteTransaction(transaction._id)}
                >
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