// types/survey.ts
import type { ReactNode, ReactElement, JSX } from "react";
export type VisitorType =
  | "excavator"
  | "mixture_machine"
  | "construction_material"
  | "cement steel store"
  | "local supplier"
  | "marbal & tile store"
  | "concrete product"
  | "other";

export type ConstructionMaterial = "sand" | "bricks" | "cement" | "steel";
export type ShopStatus = "with_shop" | "without_shop";

export interface VisitFormData {
  employeeId?: string;
  visitorType: VisitorType[];
  hasVisitingCard: boolean;
  visitingCard?: File | null;
  description?: string;
  vendorName?: string;
  ownerName?: string;
  contact1?: string;
  contact2?: string;
  whatsappNumber?: string;
  address?: string;
  pincode?: string;
  constructionMaterials?: ConstructionMaterial[];
  shopStatus?: ShopStatus;
  
}

export interface  Survey  {
  id?: any;
  employee: {};
  constructionMaterials: string;
  employeeId: string;
  visitorType: string;
  description?: string;
  vendorName?: string;
  materialName?: string;
  ownerName?: string;
  contact1?: string;
  contact2?: string;
  whatsappNumber?: string;
  address?: string;
  pincode?: string;
  shopStatus?: string;
  createdAt?: string;
  hasVisitingCard?: boolean; // Add this to match VisitFormData
  visitingCardUrl?: string; // Simplify type to string only
};