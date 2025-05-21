
export interface Worksheet {
    id: string;
    content: string;
    time: string;
    employeeId: string;
    createdAt?: string;
    updatedAt?: string;
  }

  
export interface Props {
    worksheets: Worksheet[];
    isLoading: boolean;
    onEdit: (worksheet: Worksheet) => void;
    onDelete: (id: string) => void;
    onViewMore: (content: string) => void;
    currentPage: number;
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  }

export interface ModalProps {
  show: boolean;
  onClose: () => void;
  onSubmit: () => void;
  formData: string;
  onChange: (value: string) => void;
  currentDateTime: string;
  editingWorksheet: Worksheet | null;
  isLoading: boolean;
}  

export interface ViewModalProps {
    show: boolean;
    onClose: () => void;
    content: string;
  }