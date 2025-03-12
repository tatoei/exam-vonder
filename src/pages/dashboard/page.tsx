import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import React, { useState } from 'react';
import * as XLSX from "xlsx";

// Types
interface Transaction {
  id: string;
  date: string;
  item: string;
  income: string;
  expense: string;
  balance: string;
}

const DashboardPage: React.FC = () => {
  const [transactionData, setTransactionData] = useState<Transaction[]>([
    {
      id: "1",
      date: "01/01/2025",
      item: "รายรับจากการขาย",
      income: "$500.00",
      expense: "$0.00",
      balance: "$500.00"
    },
    {
      id: "2",
      date: "02/01/2025",
      item: "ค่าใช้จ่ายการซื้อสินค้า",
      income: "$0.00",
      expense: "$200.00",
      balance: "$300.00"
    }
  ]);

  const [open, setOpen] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    date: new Date().toISOString().split('T')[0],
    item: '',
    transactionType: 'income',
    amount: ''
  });
  const [userName, setUserName] = useState<string>('Sararawee');

  // Calculate current balance
  const getCurrentBalance = (): number => {
    if (transactionData.length === 0) return 0;
    const lastTransaction = transactionData[transactionData.length - 1];
    return parseFloat(lastTransaction.balance.replace('$', ''));
  };

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
  const handleAddTransaction = () => {
    if (!newTransaction.item || !newTransaction.amount || isNaN(Number(newTransaction.amount))) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วนและถูกต้อง');
      return;
    }

    const currentBalance = getCurrentBalance();
    const amount = parseFloat(newTransaction.amount);

    let newBalance: number;
    let incomeAmount = "$0.00";
    let expenseAmount = "$0.00";

    if (newTransaction.transactionType === 'income') {
      newBalance = currentBalance + amount;
      incomeAmount = `$${amount.toFixed(2)}`;
    } else {
      newBalance = currentBalance - amount;
      expenseAmount = `$${amount.toFixed(2)}`;
    }

    const transaction: Transaction = {
      id: Date.now().toString(),
      date: newTransaction.date,
      item: newTransaction.item,
      income: incomeAmount,
      expense: expenseAmount,
      balance: `$${newBalance.toFixed(2)}`
    };

    setTransactionData([...transactionData, transaction]);

    // Reset form
    setNewTransaction({
      date: new Date().toISOString().split('T')[0],
      item: '',
      transactionType: 'income',
      amount: ''
    });

    // Close dialog
    setOpen(false);
  };

  // Delete transaction
  const handleDeleteTransaction = (id: string) => {
    const updatedTransactions = transactionData.filter(transaction => transaction.id !== id);

    // Recalculate balances
    let balance = 0;
    const recalculatedTransactions = updatedTransactions.map((transaction, index) => {
      const income = parseFloat(transaction.income.replace('$', '')) || 0;
      const expense = parseFloat(transaction.expense.replace('$', '')) || 0;

      balance = balance + income - expense;

      return {
        ...transaction,
        balance: `$${balance.toFixed(2)}`
      };
    });

    setTransactionData(recalculatedTransactions);
  };

  const exportToExcel = () => {
    const dataForExport = transactionData.map(({ id, ...rest }) => rest);
    const ws = XLSX.utils.json_to_sheet(dataForExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Transactions");
    XLSX.writeFile(wb, "transactions.xlsx");
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

      {/* Text */}
      <div className='mt-5 text-xl flex justify-center font-bold'>ระบบบันทึกบัญชี รายรับ - รายจ่าย</div>

      {/* Search and Select */}
      <div className="flex justify-center items-center space-x-4 mb-4 mt-5">
        <input
          type="text"
          placeholder="ค้นหา"
          className="border rounded p-2 h-10 w-[490px]"
        />
        <Select>
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
          {transactionData.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell className="text-center">{transaction.date}</TableCell>
              <TableCell className="text-center">{transaction.item}</TableCell>
              <TableCell className="text-center">{transaction.income}</TableCell>
              <TableCell className="text-center">{transaction.expense}</TableCell>
              <TableCell className="text-center">{transaction.balance}</TableCell>
              <TableCell className="text-center">
                <Button
                  variant="danger"
                  size="default"
                  onClick={() => handleDeleteTransaction(transaction.id)}
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