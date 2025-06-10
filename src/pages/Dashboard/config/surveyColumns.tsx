import { Column } from "../../../components/GenericTable";
import { Survey } from "../types/survey";
import { Button } from "react-bootstrap";
import moment from "moment";

export const getSurveyColumns = (
  userProfile: any,
  touchedSurveyIds: string[]  = [],
  setShowEmployeeDetailsModal: (details: any) => void,
  setSelectedImage: (image: string | null) => void
): Column<Survey & { actions?: any }>[] => [
  {
    key: userProfile?.isAdmin === "false" ? "id" : "employeeId",
    title: userProfile?.isAdmin === "false" ? "Serial No." : "Employee ID",
    sortable: true,
    render: (row) => {
      const isTouched =
        Array.isArray(touchedSurveyIds) && touchedSurveyIds.includes(row.id);
      const isNew =
        moment().diff(moment(row.createdAt), "hours") <= 72 && !isTouched;

      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "6px",
          }}
        >
          <span>{row.id}</span>
          {userProfile?.isAdmin === "true" && isNew && (
            <span
              style={{
                backgroundColor: "#28a745",
                color: "#fff",
                padding: "2px 8px",
                borderRadius: "10px",
                fontSize: "10px",
                fontWeight: "bold",
              }}
            >
              NEW
            </span>
          )}
          {userProfile?.isAdmin === "true" && (
            <div>
              <Button
                variant="primary"
                size="sm"
                style={{ fontSize: "12px" }}
                onClick={() =>
                  setShowEmployeeDetailsModal({
                    details: row?.employee,
                    status: true,
                  })
                }
              >
                Details
              </Button>
            </div>
          )}
        </div>
      );
    },
  },
  { key: "ownerName", title: "Owner Name", sortable: true },
  { key: "visitorType", title: "Visitor Type" },
  { key: "constructionMaterials", title: "Material Name" },
  { key: "description", title: "Description" },
  { key: "contact1", title: "Contact" },
  { key: "contact2", title: "Alt. Contact" },
  {
    key: "visitingCardUrl",
    title: "Visiting Card",
    render: (row) => {
      return row.visitingCardUrl ? (
        <div
          style={{ display: "flex", justifyContent: "center", width: "100%" }}
        >
          <img
            src={String(row.visitingCardUrl)}
            alt="Visiting Card"
            style={{
              width: "60px",
              height: "60px",
              objectFit: "cover",
              cursor: "pointer",
            }}
            onClick={() =>
              setSelectedImage(
                typeof row.visitingCardUrl === "string"
                  ? row.visitingCardUrl
                  : null
              )
            }
          />
        </div>
      ) : (
        "No Image"
      );
    },
  },
  { key: "pincode", title: "Pincode" },
  { key: "address", title: "Address" },
  { key: "createdAt", title: "Created At" },
];
