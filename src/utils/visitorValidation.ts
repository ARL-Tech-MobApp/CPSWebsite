// visitorValidation.ts
import * as Yup from "yup";

export const stepOneSchema = Yup.object().shape({
  visitorType: Yup.array().min(1, "Select at least one vendor type"),
  hasVisitingCard: Yup.boolean(),
});

export const stepTwoSchema = Yup.object().shape({
  visitingCard: Yup.mixed().when("hasVisitingCard", {
    is: true,
    then: (schema) => schema.required("Visiting card is required"),
  }),
  description: Yup.string().required("Description is required"),
  constructionMaterials: Yup.array().when("visitorType", {
    is: (types: string[]) => types.includes("construction_material"),
    then: (schema) =>
      schema.min(1, "Select at least one construction material"),
    otherwise: (schema) => schema.notRequired(),
  }),
  shopStatus: Yup.string().nullable(),
});

export const stepThreeSchema = Yup.object().shape({
  vendorName: Yup.string().required("Vendor name is required"),
  ownerName: Yup.string().required("Owner name is required"),
  contact1: Yup.string()
    .matches(/^[0-9]{10}$/, "Enter a valid 10-digit number")
    .required("Primary contact is required"),
  contact2: Yup.string()
    .matches(/^[0-9]{10}$/, "Enter a valid 10-digit number")
    .nullable(),
  address: Yup.string().required("Address is required"),
  pincode: Yup.string()
    .matches(/^[0-9]{6}$/, "Enter a valid 6-digit pincode")
    .required("Pincode is required"),
});
