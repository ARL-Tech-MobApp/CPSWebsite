import React from "react";
import { Column } from "../../../components/GenericTable";
import { Expense } from "../types/expense";

export const getExpenseColumns = (
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
];
