// src/services/worksheetService.ts
import moment from "moment";
import { Worksheet} from "../pages/Dashboard/types/worksheet";
import { Api } from "../api/api";


export async function fetchWorksheetsApi(userProfile: any): Promise<Worksheet[]> {
  const url =
    userProfile?.isAdmin === "true"
      ? `Prod/get-worksheet`
      : `Prod/get-worksheets-by-employee?employeeId=${userProfile?.id}`;

  try {
    const response = await Api.get<{ worksheets: Worksheet[] }>(url);
    const worksheets = response.data.worksheets || [];

    // Sort by time desc
    return worksheets.sort(
      (a, b) => moment(b.time).valueOf() - moment(a.time).valueOf()
    );
  } catch (error) {
    throw new Error("Failed to fetch worksheets");
  }
}

export async function addOrUpdateWorksheetApi(worksheetData: Partial<Worksheet>): Promise<void> {
  try {
    await Api.post("Prod/add-worksheet", worksheetData);
    console.log(`add successfully`);
  } catch (error) {
    throw new Error("Failed to save worksheet");
  }
}

export async function deleteWorksheetApi(worksheetId: string): Promise<void> {
  try {
    const response = await Api.post("Prod/delete-worksheet", {  headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ worksheetId }),
     });
    if (response.status !== 200) {
      throw new Error("Failed to delete worksheet");
    }
  } catch (error) {
    throw new Error("Failed to delete worksheet");
  }
}
