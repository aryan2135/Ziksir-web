import PrototypingModel from "../models/prototypingReq.model";

export class PrototypingService {
  async addPrototyping(data: any) {
    const prototyping = new PrototypingModel(data);
    return await prototyping.save();
  }

  async deletePrototyping(id: string) {
    return await PrototypingModel.findByIdAndDelete(id);
  }
}
