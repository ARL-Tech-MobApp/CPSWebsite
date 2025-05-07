// surveyStore.ts
import { create } from "zustand";
import { ReactNode, ReactElement, JSX } from "react";
import axios from "axios";

// Define the Survey type directly in the store
export type Survey = {
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
  address?: string;
  pincode?: string;
  shopStatus?: string;
  visitingCardUrl?:
    | ReactNode
    | ReactElement
    | JSX.Element
    | undefined
    | string
    | HTMLImageElement;
  createdAt?: string;
};

interface SurveyState {
  surveys: Survey[];
  lastKey: string | null; // Add a state for lastKey
  surveyloading: boolean;
  error: string | null;
  fetchSurveys: (limit?: string, lastKey?: string | null) => Promise<void>;
  addSurvey: (surveyData: Omit<Survey, "id">) => Promise<void>;
}

type SurveyResponse = {
  surveys: Survey[];
  lastEvaluatedKey: string | null;
};

export const useSurveyStore = create<SurveyState>((set) => ({
  
  surveys: [],
  surveyloading: false,
  error: null,
 lastKey: null, // Add a state for lastKey

  fetchSurveys: async (limit, lastKey = null) => {
    console.log("Fetching surveys with limit:", limit, "and lastKey:", lastKey);
    set({ surveyloading: true, error: null });
    try {
      const response = await axios.get<SurveyResponse>(
        `https://fxosysucf1.execute-api.ap-south-1.amazonaws.com/Prod/get-survey?limit=${limit}&lastKey=${lastKey || ''}`
      );
      set((state) => ({
        surveys: lastKey ? [...state.surveys, ...response.data.surveys] : response.data.surveys, // Append data for pagination
        lastKey: response.data.lastEvaluatedKey || null, // Update lastKey for the next request
        surveyloading: false,
      }));
    }catch (error) {
      set({ error: "Failed to fetch surveys", surveyloading: false });
    }
  },
  

  addSurvey: async (surveyData) => {
    set({ surveyloading: true, error: null });
    try {
      const response = await axios.post<Survey>(
        "https://fxosysucf1.execute-api.ap-south-1.amazonaws.com/Prod/add-survey",
        surveyData
      );
      set((state) => ({
        surveys: [...state.surveys, response.data],
        surveyloading: false,
      }));
    } catch (error) {
      set({ error: "Failed to add survey", surveyloading: false });
      throw error;
    }
  },
}));
