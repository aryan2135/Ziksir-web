import ConsultingRequest from "../models/consultingReq.model";

class ConsultingService {
  async createConsultingRequest(data: any) {
    console.log(data);
    const newRequest = new ConsultingRequest(data);
    return await newRequest.save();
  }

  async deleteConsultingRequest(id: string) {
    return await ConsultingRequest.findByIdAndDelete(id);
  }

  async getAllConsultingRequests() {
    return await ConsultingRequest.find().sort({ createdAt: -1 });
  }
  async updateConsultingRequest(id: string, data: any) {
    return await ConsultingRequest.findByIdAndUpdate(id, data, { new: true });
  }
  async getUserConsultingRequests(email: string) {
    return await ConsultingRequest.find({ email }).sort({ createdAt: -1 });
  }
}

export const consultingService = new ConsultingService();
