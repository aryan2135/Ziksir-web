import ConsultingRequest from "../models/consultingReq.model";

class ConsultingService {
  async createConsultingRequest(data: any) {
    const newRequest = new ConsultingRequest(data);
    return await newRequest.save();
  }

  async deleteConsultingRequest(id: string) {
    return await ConsultingRequest.findByIdAndDelete(id);
  }
}

export const consultingService = new ConsultingService();
