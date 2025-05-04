import React, { useState, useMemo } from "react";
import {
  Table,
  Form,
  InputGroup,
  Pagination,
  Row,
  Col,
  Card,
} from "react-bootstrap";
import { BsSearch, BsArrowUp, BsArrowDown } from "react-icons/bs";

const SearchIcon = BsSearch as unknown as React.FC;
const UpIcon = BsArrowUp as unknown as React.FC;
const DownIcon = BsArrowDown as unknown as React.FC;

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
  themeColor?: string;
  onSelectionChange?: (selectedRows: T[]) => void;
  hidePagination?: boolean;
  hideSearch?: boolean;
  heading?: string;
  idKey?: keyof T;
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
}: TableProps<T>) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortColumn, setSortColumn] = useState<keyof T | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<T[]>([]);

  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return data;
    return data.filter((row) =>
      columns.some((col) =>
        row[col.key]
          ?.toString()
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, data, columns]);

  const sortedData = useMemo(() => {
    if (!sortColumn) return filteredData;
    return [...filteredData].sort((a, b) => {
      const valA = a[sortColumn];
      const valB = b[sortColumn];
      if (typeof valA === "number" && typeof valB === "number") {
        return sortOrder === "asc" ? valA - valB : valB - valA;
      } else {
        return sortOrder === "asc"
          ? String(valA).localeCompare(String(valB))
          : String(valB).localeCompare(String(valA));
      }
    });
  }, [sortColumn, sortOrder, filteredData]);

  const totalPages = Math.ceil(sortedData.length / rowsPerPage);
  const paginatedData = hidePagination
    ? sortedData
    : sortedData?.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
      );

  const handleSort = (columnKey: keyof T) => {
    if (sortColumn === columnKey) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(columnKey);
      setSortOrder("asc");
    }
  };

  const toggleRowSelection = (row: T) => {
    let newSelectedRows = [...selectedRows];
    if (selectedRows.some((selected) => selected[idKey] === row[idKey])) {
      newSelectedRows = newSelectedRows.filter(
        (selected) => selected[idKey] !== row[idKey]
      );
    } else {
      newSelectedRows.push(row);
    }
    setSelectedRows(newSelectedRows);
    if (onSelectionChange) onSelectionChange(newSelectedRows);
  };

  const toggleAllSelection = () => {
    if (selectedRows.length === paginatedData.length) {
      setSelectedRows([]);
      if (onSelectionChange) onSelectionChange([]);
    } else {
      setSelectedRows([...paginatedData]);
      if (onSelectionChange) onSelectionChange([...paginatedData]);
    }
  };

  const renderPagination = () => {
    const getPageRange = () => {
      const range: (number | "...")[] = [];
      const delta = 1;

      if (totalPages <= 7) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
      }

      const left = Math.max(currentPage - delta, 2);
      const right = Math.min(currentPage + delta, totalPages - 1);

      range.push(1);
      if (left > 2) range.push("...");

      for (let i = left; i <= right; i++) {
        range.push(i);
      }

      if (right < totalPages - 1) range.push("...");
      range.push(totalPages);

      return range;
    };

    const pagesToDisplay = getPageRange();

    return (
      <Pagination className="justify-content-end">
        <Pagination.Prev
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        />
        
        {pagesToDisplay.map((page, idx) =>
          page === "..." ? (
            <Pagination.Ellipsis key={idx} />
          ) : (
            <Pagination.Item
              key={page}
              active={currentPage === page}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </Pagination.Item>
          )
        )}
        
        <Pagination.Next
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
        />
      </Pagination>
    );
  };

  return (
    <Card className="shadow-sm">
      <Card.Body>
        {heading && <Card.Title className="text-center mb-4">{heading}</Card.Title>}

        {!hideSearch && (
          <InputGroup className="mb-3">
            <InputGroup.Text>
              <SearchIcon />
            </InputGroup.Text>
            <Form.Control
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </InputGroup>
        )}

        <div className="table-responsive">
          <Table striped bordered hover>
            <thead style={{ backgroundColor: themeColor, color: "white" }}>
              <tr>
                <th style={{ width: "40px" }}>
                  <Form.Check
                    checked={
                      selectedRows.length === paginatedData.length &&
                      paginatedData.length > 0
                    }
                    onChange={toggleAllSelection}
                  />
                </th>
                {columns.map((col) => (
                  <th
                    key={col.key as string}
                    onClick={() => col.sortable && handleSort(col.key)}
                    style={{ cursor: col.sortable ? "pointer" : "default" }}
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      {col.title}
                      {col.sortable && (
                        <span>
                          {sortColumn === col.key ? (
                            sortOrder === "asc" ? (
                              <UpIcon />
                            ) : (
                              <DownIcon />
                            )
                          ) : (
                            <span style={{ width: "16px", display: "inline-block" }} />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedData.length > 0 ? (
                paginatedData.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    <td>
                      <Form.Check
                        checked={selectedRows.some(
                          (selected) => selected[idKey] === row[idKey]
                        )}
                        onChange={() => toggleRowSelection(row)}
                      />
                    </td>
                    {columns.map((col) => (
                      <td key={col.key as string}>
                        {col.render ? col.render(row) : row[col.key]}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length + 1} className="text-center">
                    No data found
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>

        {!hidePagination && (
          <Row className="d-flex align-items-center justify-content-between">
            <Col>
              <div className="text-muted">
                Showing {(currentPage - 1) * rowsPerPage + 1} to{" "}
                {Math.min(currentPage * rowsPerPage, sortedData.length)} of{" "}
                {sortedData.length} results
              </div>
            </Col>
            <Col xs="auto">
              {renderPagination()}
            </Col>
          </Row>
        )}
      </Card.Body>
    </Card>
  );
};

export default GenericTable;