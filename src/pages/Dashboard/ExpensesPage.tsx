// ExpensesPage.tsx
import React, { useState,useEffect } from 'react';
import { Expense } from './types/expense';
import ExpenseModal from "./component/ExpensiveComp/ExpenseModal";
import './modal.css'; // Import the modal styles
import { getExpenseColumns } from './config/expensiveColumns';
import GenericTable from '../../components/GenericTable';
import { useAuthStore } from '../../stores/useAuthStore';
import {postReimbursement,getReimbursementsByEmployee} from '../../services/expensiveService';
import ImagePreviewModal from './component/ImagePreviewModal';

const ExpensesPage: React.FC = () => {
    const { userProfile } = useAuthStore();
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [viewingExpense, setViewingExpense] = useState<Expense | null>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);


    const fetchExpenses = async () => {
      if (!userProfile?.id) return;
  
      try {
        const data = await getReimbursementsByEmployee(userProfile?.id, (userProfile?.isAdmin === "true").toString());
        setExpenses(data?.reimbursements || []);
      } catch (err) {
        console.error("Failed to fetch expenses", err);
      }
    };

useEffect(() => {   
    fetchExpenses();
  }, [userProfile]);

    const handleSubmit = async (data: Omit<Expense, 'id' | 'createdAt' | 'approved'>) => {
      
      try {
        const payload = {
id: selectedExpense?.id || "",          
date:data?.date,
endImage:data?.endImage,
startImage:data?.startImage,
kilometers:data?.kilometers,
employeeId: userProfile?.id ?? "", // ensure employeeId is always a string
purpose:data?.purpose || "",
        };
        const response = await postReimbursement(payload);
        if(response) {
        await fetchExpenses();
        }
    
        setSelectedExpense(null);
        setIsModalOpen(false);
      } catch (error) {
        console.error("Error submitting reimbursement", error);
      }
    };
    
  
    const handleView = (row: Expense) => {
      setViewingExpense(row);
    };
  
    const handleEditExpense = (row: Expense) => {
      console.log("selectedExpense?.id",row?.id)
      setSelectedExpense(row);
      setIsModalOpen(true);
    };
  
    const deleteExpense = (record: Expense) => {
      setExpenses(prev => prev.filter(e => e.id !== record.id));
    };
  

   
    
    return (
      <div className="expenses-page">
  
        <GenericTable
          columns={getExpenseColumns((imageUrl) => setSelectedImage(imageUrl))}
          data={expenses}
          rowsPerPage={11}
          themeColor="#6200ea"
          onSelectionChange={(selectedRows) => console.log(selectedRows)}
          hidePagination={false}
          hideSearch={false}
          heading="Expenses"
          idKey="id"
          fetch={fetchExpenses}
          lastkey={null}
          onView={handleView}
          onEdit={handleEditExpense}
          onDelete={deleteExpense}
          onAdd={() => {
            setSelectedExpense(null);
            setIsModalOpen(true);
          }}
          
          
        />
  
        <ExpenseModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedExpense(null);
          }}
          onSubmit={handleSubmit}
          initialData={selectedExpense || undefined}
          empId={userProfile?.id ?? ""}

        />
          <ImagePreviewModal
        imageUrl={selectedImage} 
        onClose={() => setSelectedImage(null)}
      />
 {viewingExpense && (
  <div className="image-modal">
    <div className="modal-content" style={{ maxWidth: 700, padding: 20 }}>
      <span
        className="close"
        onClick={() => setViewingExpense(null)}
        style={{ cursor: 'pointer', float: 'right', fontSize: 24 }}
      >
        &times;
      </span>

      <h2>Expense Details</h2>
      <p><strong>Date:</strong> {new Date(viewingExpense.date).toLocaleDateString()}</p>
      <p><strong>Start KM:</strong> {viewingExpense.startReading}</p>
      <p><strong>End KM:</strong> {viewingExpense.endReading}</p>
      <p><strong>Total KM:</strong> {viewingExpense.kilometers}</p>

      <div style={{ display: 'flex', gap: 20 }}>
        <div style={{ flex: 1 }}>
          <h4> Start Image</h4>
          <img
            src={viewingExpense.startMeterUrl}
            alt="Station start meter reading"
            style={{ width: '100%', borderRadius: 8 }}
          />
        </div>
        <div style={{ flex: 1 }}>
          <h4>End Image</h4>
          <img
            src={viewingExpense.endMeterUrl}
            alt="Employee start meter reading"
            style={{ width: '100%', borderRadius: 8 }}
          />
        </div>
      </div>



      {/* Approve button, status etc. */}
      {userProfile?.isAdmin === "true" && !viewingExpense.approved && (
        <button
          onClick={() => {
            setExpenses(prev =>
              prev.map(e =>
                e.id === viewingExpense.id ? { ...e, approved: true } : e
              )
            );
            setViewingExpense(prev => prev ? { ...prev, approved: true } : null);
          }}
          style={{
            marginTop: 20,
            padding: '10px 20px',
            backgroundColor: 'green',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            borderRadius: 4,
          }}
        >
          Approve
        </button>
      )}

      {viewingExpense.approved && (
        <p
          style={{
            marginTop: 20,
            color: 'green',
            fontWeight: 'bold',
            fontSize: 16,
          }}
        >
          Approved
        </p>
      )}
    </div>
  </div>
)}

      </div>
    );
  };
  

export default ExpensesPage;
