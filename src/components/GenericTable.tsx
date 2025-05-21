import React, { useState, useMemo } from "react";
import { Table, Input, Typography, Space, Tooltip, Modal } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { TableRowSelection } from "antd/es/table/interface";
import { SearchOutlined, EyeOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;
const { confirm } = Modal;

export interface Column<T> {
  key: keyof T;
  title: string;
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  rowsPerPage?: number;
  themeColor?: string; // header bg color
  onSelectionChange?: (selectedRows: T[]) => void;
  hidePagination?: boolean;
  hideSearch?: boolean;
  heading?: string;
  idKey?: keyof T;
  fetch?: (lastKey: string | null) => Promise<void>;
  lastkey?: string | null;
  searchKeys?: (keyof T)[];
  onAdd?: () => void;
  // New action handlers:
  onView?: (record: T) => void;
  onEdit?: (record: T) => void;
  onDelete?: (record: T) => void;
  btnTitle?: string;
  styleTitle?: React.CSSProperties;
}

const GenericTable = <T extends Record<string, any>>({
  columns,
  data,
  rowsPerPage = 5,
  themeColor = "#6200ea",
  onSelectionChange,
  hidePagination = false,
  hideSearch = false,
  heading,
  idKey = "id" as keyof T,
  fetch,
  lastkey,
  searchKeys,
  onView,
  onEdit,
  onDelete,
  onAdd,
  btnTitle = "Add New",
  styleTitle = {
    color: "white",
    border: "none",
    padding: "8px 16px",
    borderRadius: 4,
    cursor: "pointer",
  },
}: TableProps<T>) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Filter data based on search query (case insensitive)
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return data;
  
    const keysToSearch = searchKeys?.length ? searchKeys : columns.map((col) => col.key);
  
    return data.filter((row) =>
      keysToSearch.some((key) => {
        const value = row[key];
        return (
          value &&
          value
            .toString()
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        );
      })
    );
  }, [searchQuery, data, columns, searchKeys]);
  

  // Build Ant Design columns from your columns + add Actions column
// Base table columns
const antdColumns: ColumnsType<T> = [
  ...columns.map((col) => ({
    title: (
      <div
        style={{
          userSelect: "none",
          cursor: col.sortable ? "pointer" : "default",
          color: "black",
          fontWeight: 600,
        }}
      >
        {col.title}
      </div>
    ),
    dataIndex: col.key as string,
    key: col.key as string,
    sorter: col.sortable
      ? ((a: T, b: T): number => {
          const valA: any = a[col.key];
          const valB: any = b[col.key];
          if (typeof valA === "number" && typeof valB === "number") {
            return valA - valB;
          }
          return String(valA).localeCompare(String(valB));
        })
      : undefined,
    render: (_: any, record: T): React.ReactNode =>
      col.render ? col.render(record) : record[col.key],
  })),

  // Conditionally add Actions column
  ...(onView || onEdit || onDelete
    ? [
        {
          title: (
            <div
              style={{
                userSelect: "none",
                color: "black",
                fontWeight: 600,
                textAlign: "center",
              }}
            >
              Actions
            </div>
          ),
          key: "actions",
          fixed: 'right' as const,
          width: 130,
          render: (_: any, record: T) => (
            <Space
              size="middle"
              style={{ justifyContent: "center", display: "flex" }}
            >
              {onView && (
                <Tooltip title="View">
                  <EyeOutlined
                    style={{ color: "#1890ff", cursor: "pointer" }}
                    onClick={() => onView(record)}
                  />
                </Tooltip>
              )}
              {onEdit && (
                <Tooltip title="Edit">
                  <EditOutlined
                    style={{ color: "#52c41a", cursor: "pointer" }}
                    onClick={() => onEdit(record)}
                  />
                </Tooltip>
              )}
              {onDelete && (
                <Tooltip title="Delete">
                  <DeleteOutlined
                    style={{ color: "#ff4d4f", cursor: "pointer" }}
                    onClick={() => {
                      confirm({
                        title: "Are you sure you want to delete this item?",
                        icon: <ExclamationCircleOutlined />,
                        okText: "Yes",
                        okType: "danger",
                        cancelText: "No",
                        onOk() {
                          onDelete(record);
                        },
                      });
                    }}
                  />
                </Tooltip>
              )}
            </Space>
          ),
        },
      ]
    : []),
];


  // Row selection config
  interface RowSelectionChangeParams<T> {
    selectedRowKeys: React.Key[];
    selectedRows: T[];
  }

  interface RowSelectionCheckboxProps<T> {
    name: string;
  }

  const rowSelection: TableRowSelection<T> = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: T[]): void => {
      if (onSelectionChange) onSelectionChange(selectedRows);
    },
    getCheckboxProps: (record: T): RowSelectionCheckboxProps<T> => ({
      name: String(record[idKey]),
    }),
  };

  // Pagination config
  interface PaginationConfig {
    current: number;
    pageSize: number;
    total: number;
    showSizeChanger: boolean;
    onChange: (page: number) => void;
    showTotal: (total: number, range: [number, number]) => string;
    showQuickJumper: boolean;
  }

  const paginationConfig: false | PaginationConfig = hidePagination
    ? false
    : {
        current: currentPage,
        pageSize: rowsPerPage,
        total: filteredData.length,
        showSizeChanger: false,
        onChange: (page: number) => setCurrentPage(page),
        showTotal: (total: number, range: [number, number]) =>
          `Showing ${range[0]}-${range[1]} of ${total} results`,
        showQuickJumper: true,
      };

  return (
    <div>
   <div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  }}
>
  {!hideSearch && (
    <Input
      prefix={<SearchOutlined />}
      placeholder="Search..."
      value={searchQuery}
      onChange={(e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
      }}
      style={{ maxWidth: 300 }}
      allowClear
    />
  )}

  {/* Example right-side button */}
  <button
    style={styleTitle}
    onClick={() => {
      if (onAdd) {
        onAdd();
      } else {
        console.log("Add button clicked");
      }
    }}
  >
  {btnTitle}
  </button>
</div>

<div
  style={{
    overflowX: "auto",
    scrollbarWidth: "none", // Firefox
    msOverflowStyle: "none", // IE/Edge
  }}
  className="hide-scrollbar" // Add this class name
>
      <Table<T>
        rowKey={(record) => String(record[idKey])}
        columns={antdColumns}
        dataSource={filteredData}
        rowSelection={rowSelection}
        pagination={paginationConfig}
        bordered
        scroll={{ x: "max-content" }}
        style={{
          borderRadius: 10,
          overflow: "hidden",
          boxShadow:
            "0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.06)",
            
        }}
        onHeaderRow={() => ({
          style: {
            backgroundColor: themeColor,
            color: "black",
            fontWeight: 600,
            fontSize: 16,
          },
        })}
      />
       </div>

{/* 🔽 Extra style to hide WebKit scrollbar */}
<style>{`
  div::-webkit-scrollbar {
    display: none;
  }
    
`}</style>
    </div>
  );
};

export default GenericTable;
