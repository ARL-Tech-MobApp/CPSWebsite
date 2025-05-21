export interface Expense {
  id?: string;
  employeeId: string;
  startReading?: string;
  endReading?: string;
  kilometers: string;
  startImage: string;
  endImage: string;
  date: string;
  approved?: boolean;
  purpose?: string;
  startMeterUrl?: string;
  endMeterUrl?: string;
}

export interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Expense, 'id' | 'createdAt'>) => void;
  initialData?: Expense;
  empId: string;
}
