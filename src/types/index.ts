export interface Expense {
    _id?: string;
    title: string;
    amount: number;
    category: string;
    date: string;
    description?: string;
}

export interface Category {
    _id?: string;
    name: string;
    color?: string;
    icon?: string;
}

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
} 