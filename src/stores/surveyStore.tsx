// surveyStore.ts
import { create } from "zustand";
import { ReactNode, ReactElement, JSX } from "react";
import axios from "axios";

// Define the Survey type directly in the store
export type Survey = {
  employeeId: string;
  serviceType: string;
  description?: string;
  vendorName?: string;
  materialName?: string;
  ownerName?: string;
  contact1?: string;
  contact2?: string;
  address?: string;
  pincode?: string;
  shopType?: string;
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
  surveyloading: boolean;
  error: string | null;
  fetchSurveys: () => Promise<void>;
  addSurvey: (surveyData: Omit<Survey, "id">) => Promise<void>;
}

type SurveyResponse = {
  surveys: Survey[];
};

export const useSurveyStore = create<SurveyState>((set) => ({
  surveys: [],
  surveyloading: false,
  error: null,

  fetchSurveys: async () => {
    set({ surveyloading: true, error: null });
    try {
      const response = await axios.get<SurveyResponse>(
        "https://fxosysucf1.execute-api.ap-south-1.amazonaws.com/Prod/get-survey"
      );
      set({ surveys: response.data.surveys, surveyloading: false });
    } catch (error) {
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
