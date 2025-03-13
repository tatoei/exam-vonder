interface SummaryProps {
    totalIncome: number;
    totalExpense: number;
    balance: number;
}

export function Summary({ totalIncome, totalExpense, balance }: SummaryProps) {
    return (
        <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-green-100 rounded-lg">
                <h3 className="text-lg font-medium text-green-800">Total Income</h3>
                <p className="text-2xl font-bold text-green-600">฿{totalIncome.toLocaleString()}</p>
            </div>
            <div className="p-4 bg-red-100 rounded-lg">
                <h3 className="text-lg font-medium text-red-800">Total Expense</h3>
                <p className="text-2xl font-bold text-red-600">฿{totalExpense.toLocaleString()}</p>
            </div>
            <div className="p-4 bg-blue-100 rounded-lg">
                <h3 className="text-lg font-medium text-blue-800">Balance</h3>
                <p className={`text-2xl font-bold ${balance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                    ฿{balance.toLocaleString()}
                </p>
            </div>
        </div>
    );
} 