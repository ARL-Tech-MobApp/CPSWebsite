
import Api from '../api/api';

interface ReimbursementData {
    employeeId: string;
    startReading?: string;
    endReading?: string;
    kilometers: string;
    startImage?: File | string;
    endImage?: File | string;
    date: string;
    purpose?: string;
  }
  export interface UploadUrlsResponse {
    startMeterUploadUrl?: string;
    endMeterUploadUrl?: string;
  }
  
  export interface ReimbursementResponse extends UploadUrlsResponse {
    message: string;
    reimbursementId: string;
  }
interface ApiResponse<T = any> {
    status: number;
    statusText: string;
    data: T;
}

export const postReimbursement = async (data: ReimbursementData): Promise<any> => {
    try {
      const response: ApiResponse = await Api.post('Prod/add-reimbursement', data);
  
      if (response && response.data) {
        console.log('Reimbursement added successfully:', response.data);
  
        const { startMeterUploadUrl, endMeterUploadUrl } = response.data;

        const uploadPromises: Promise<any>[] = [];
    
        if (startMeterUploadUrl && data.startImage instanceof File) {
            console.log('Uploading start image:', data.startImage.type);
          uploadPromises.push(
            Api.put(startMeterUploadUrl, data.startImage, {
              headers: {
                'Content-Type': data.startImage.type || 'application/octet-stream',
              },
            })
          );
        }
    
        if (endMeterUploadUrl && data.endImage instanceof File) {
          uploadPromises.push(
            Api.put(endMeterUploadUrl, data.endImage, {
              headers: {
                'Content-Type': data.endImage.type || 'application/octet-stream',
              },
            })
          );
        }
    
        await Promise.all(uploadPromises);
  
        console.log('Both images uploaded successfully');
  
        return response.data;
      } else {
        throw new Error('Failed to add reimbursement');
      }
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  };
  
export  const getReimbursementsByEmployee = async (employeeId: string,type:string): Promise<any> => {
    const url = type === "true" ?`get-reimbursementdetails`:`get-reimbursements-by-employee?employeeId=${employeeId}`;
    try {
        const response: ApiResponse = await Api.get(`Prod/${url}`);
        if (response.status === 200) {
            console.log('Reimbursements fetched successfully:', response?.data);
            return response.data;
        } else {
            console.error('Failed to fetch reimbursements:', response.statusText);
            throw new Error('Failed to fetch reimbursements');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}