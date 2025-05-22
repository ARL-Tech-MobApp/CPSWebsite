import React,{ ReactElement } from "react";
import { Pagination, Spinner, OverlayTrigger, Tooltip } from "react-bootstrap";
import moment from "moment";
import { Props } from "../../types/worksheet";
import { ITEMS_PER_PAGE } from "../../../../api/api";

import { PencilSquare, Trash, Eye } from "react-bootstrap-icons";

const WorksheetList: React.FC<Props> = ({
  worksheets,
  isLoading,
  onEdit,
  onDelete,
  onViewMore,
  currentPage,
  setCurrentPage,
}) => {
  const totalPages = Math.ceil(worksheets.length / ITEMS_PER_PAGE);
  const paginatedItems = worksheets?.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (isLoading && worksheets?.length === 0) {
    return (
      <div className="text-center mt-4">
        <Spinner animation="border" />
        <p>Loading worksheets...</p>
      </div>
    );
  }

  const IconButton = ({
    onClick,
    icon,
    tooltip,
    variant = "secondary",
    disabled = false,
  }: {
    onClick: () => void;
    icon: ReactElement;
    tooltip: string;
    variant?: string;
    disabled?: boolean;
  }) => (
    <OverlayTrigger
      placement="left"
      overlay={<Tooltip id={`tooltip-${tooltip}`}>{tooltip}</Tooltip>}
    >
      <button
        type="button"
        className={`btn btn-${variant} d-flex align-items-center justify-content-center icon-btn`}
        style={{
          width: 38,
          height: 38,
          borderRadius: "50%",
          boxShadow:
            "0 2px 6px rgb(0 0 0 / 0.1), 0 1px 4px rgb(0 0 0 / 0.06)",
          border: "none",
          padding: 0,
          cursor: disabled ? "not-allowed" : "pointer",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
        }}
        onClick={onClick}
        disabled={disabled}
        aria-label={tooltip}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => {
          if (disabled) return;
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onClick();
          }
        }}
        onMouseEnter={(e) => {
          if (!disabled) {
            (e.currentTarget as HTMLElement).style.transform = "scale(1.15)";
            (e.currentTarget as HTMLElement).style.boxShadow =
              "0 4px 12px rgba(0, 123, 255, 0.5)";
          }
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.transform = "scale(1)";
          (e.currentTarget as HTMLElement).style.boxShadow =
            "0 2px 6px rgb(0 0 0 / 0.1), 0 1px 4px rgb(0 0 0 / 0.06)";
        }}
      >
        {React.isValidElement(icon)
          ? React.cloneElement(icon as React.ReactElement<any>, { ...(icon.props || {}), size: 20 })
          : icon}
        <style>{`
          button:focus-visible {
            outline: 3px solid #007bff;
            outline-offset: 2px;
          }
        `}</style>
      </button>
    </OverlayTrigger>
  );
  

  return (
    <>
      <ul className="list-group mt-4">
        {paginatedItems.map((item) => (
          <li
            key={item.id}
            className="list-group-item"
            style={{
              borderRadius: "8px",
              marginBottom: "12px",
              padding: "15px 20px",
            }}
          >
            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start">
              {/* Left Content */}
              <div
                style={{ flex: 1, paddingRight: 15 }}
                className="mb-3 mb-sm-0"
              >
                <div
                  className="fw-bold"
                  style={{ fontSize: 16, color: "#2c3e50" }}
                >
                  {moment(item.time).format("dddd, D MMMM [at] h:mm A")}
                </div>
                <div className="text-muted" style={{ fontSize: 14 }}>
                  {moment(item.time).fromNow()}
                </div>
                <div
                  className="mt-2"
                  style={{
                    maxHeight: 100,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    color: "#34495e",
                    fontSize: 15,
                    lineHeight: 1.4,
                  }}
                  dangerouslySetInnerHTML={{
                    __html:
                      item.content.length > 150
                        ? `${item.content.substring(0, 150)}...`
                        : item.content,
                  }}
                />
                <div
                  className="text-muted mt-2"
                  style={{ fontSize: 13, fontStyle: "italic" }}
                >
                  By: {item.employeeId}
                </div>
              </div>

              {/* Right Icons stacked vertically on desktop, horizontal on mobile */}
              <div className="d-flex flex-row flex-sm-column gap-3 justify-content-start justify-content-sm-center align-items-center">
                <IconButton
                  onClick={() => onEdit(item)}
                  icon={<PencilSquare />}
                  tooltip="Edit"
                  variant="primary"
                  disabled={isLoading}
                />
                <IconButton
                  onClick={() => onDelete(item.id)}
                  icon={<Trash />}
                  tooltip="Delete"
                  variant="danger"
                  disabled={isLoading}
                />
                <IconButton
                  onClick={() => onViewMore(item.content)}
                  icon={<Eye />}
                  tooltip="View More"
                  variant="info"
                />
              </div>
            </div>
          </li>
        ))}
      </ul>

      {totalPages > 1 && (
        <Pagination className="mt-3 justify-content-center">
          {[...Array(totalPages)].map((_, i) => (
            <Pagination.Item
              key={i}
              active={i + 1 === currentPage}
              onClick={() => setCurrentPage(i + 1)}
              disabled={isLoading}
            >
              {i + 1}
            </Pagination.Item>
          ))}
        </Pagination>
      )}
    </>
  );
};

export default WorksheetList;
