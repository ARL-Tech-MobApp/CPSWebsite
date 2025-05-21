import React from "react";
import { Column } from "../../../components/GenericTable";
import { Expense } from "../types/expense";
import { Button } from "react-bootstrap";

export const getExpenseColumns = (
  handleView: (row: Expense) => void,
  handleEditExpense: (row: Expense) => void,
  deleteExpense: (id: string) => void,
  onImageClick: (imageUrl: string) => void // callback to open modal from parent
): Column<Expense>[] => [
  {
    key: "date",
    title: "Date",
    render: (row) => new Date(row.date).toLocaleDateString(),
  },
  {
    key: "startMeterUrl",
    title: "Start Image",
    render: (row) => {
      return row.startMeterUrl ? (
        <img
        src={String(row.startMeterUrl)}
        alt="Start"
        referrerPolicy="no-referrer"
        style={{
          width: "100px",
          height: "auto",
          objectFit: "cover",
          cursor: "pointer",
        }}
        onClick={() => onImageClick(String(row.startMeterUrl))}
      />
      
      ) : (
        "No Image"
      );
    },
    
  },
  {
    key: "endMeterUrl",
    title: "End Image",
    render: (row) =>
      row.endMeterUrl ? (
        <img
          src={String(row.endMeterUrl)}
          alt="End"
          style={{
            width: "100px",
            height: "auto",
            objectFit: "cover",
            cursor: "pointer",
          }}
          onClick={() => onImageClick(String(row.endMeterUrl))}
        />
      ) : (
        "No Image"
      ),
  },
  {
    key: "kilometers",
    title: "Total KM",
    render: (row) => row.kilometers,
  },
  {
    key: 'actions' as any,
    title: "Actions",
    render: (row) => (
      <div>
        <Button
          variant="primary"
          size="sm"
          className="me-2 mb-2"
          onClick={() => handleView(row)}
        >
          View
        </Button>
        <Button
          variant="secondary"
          size="sm"
          className="me-2 mb-2"
          onClick={() => handleEditExpense(row)}
        >
          Edit
        </Button>
        <Button
          variant="danger"
          size="sm"
          onClick={() => row.id && deleteExpense(row.id)}
        >
          Delete
        </Button>
      </div>
    ),
  },
];
