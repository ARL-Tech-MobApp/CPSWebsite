// surveyStore.ts
import { create } from "zustand";
import { ReactNode, ReactElement, JSX } from "react";
import axios from "axios";
import moment from "moment";

// Define the Survey type directly in the store
export type Survey = {
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
  deleteSurvey: (surveyId: any) => Promise<void>;

}

type SurveyResponse = {
  surveys: Survey[];
  lastEvaluatedKey: string | null;
};

export const useSurveyStore = create<SurveyState>((set,get) => ({
  
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
      const newSurveys = response.data.surveys || [];

    // Combine existing surveys if paginated
    const allSurveys = lastKey
      ? [...(get().surveys || []), ...newSurveys]
      : newSurveys;

    // ✅ Sort by createdAt descending (latest first)
    const sortedSurveys = allSurveys.sort((a, b) =>
      moment(b.createdAt).valueOf() - moment(a.createdAt).valueOf()
    );

    set({
      surveys: sortedSurveys,
      lastKey: response.data.lastEvaluatedKey || null,
      surveyloading: false,
    });
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
  deleteSurvey: async (surveyId: any) => {
    set({ surveyloading: true, error: null });
    console.log("Deleting survey with ID:", surveyId);
  
    if (window.confirm("Are you sure you want to delete this visitor?")) {
      try {
        await axios.delete(
          `https://fxosysucf1.execute-api.ap-south-1.amazonaws.com/Prod/delete-survey`,surveyId
        );
        set((state) => ({
          surveys: state.surveys.filter((survey) => survey.id !== surveyId),
          surveyloading: false,
        }));
  
        alert("Visitor deleted successfully.");
      } catch (error) {
        set({ error: "Failed to delete survey", surveyloading: false });
        alert("Failed to delete survey.");
        throw error;
      }
    } else {
      set({ surveyloading: false }); // In case user cancels
    }
  },
  
}));
