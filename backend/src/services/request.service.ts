import {EquipmentRequest} from '../models/request.model';
import {RequestInterface} from '../interfaces/request.interface';


class RequestService {
    async createRequest(data: RequestInterface): Promise<RequestInterface> {
        const request = new EquipmentRequest(data);
        return await request.save();
    }

    async getAllRequests(): Promise<RequestInterface[]> {
        return await EquipmentRequest.find();
    }

    async getRequestById(id: string): Promise<RequestInterface | null> {
        return await EquipmentRequest.findById(id);
    }

    async updateRequest(id: string, data: Partial<RequestInterface>): Promise<RequestInterface | null> {
        return await EquipmentRequest.findByIdAndUpdate(id, data, { new: true });
    }

    async deleteRequest(id: string): Promise<RequestInterface | null> {
        return await EquipmentRequest.findByIdAndDelete(id);
    }
}
export const requestService = new RequestService();