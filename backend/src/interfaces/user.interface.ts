export interface User extends Document {
  clientId: string;
  name: string;
  email: string;
  password: string;
  role: "admin" | "user";
  contactNo: string;
  emailId: string;
  organizationAddress: string;
  state: string;
  country: string;
  gstin: string;
  gstinNo: string;
  panNo: string;
  pincode: number;
  remarks: string;
  organizationCategory: string;
}

export interface UserData {
  clientId: string;
  name: string;
  email: string;
  password: string;
  role: "admin" | "user";
  contactNo: string;
  emailId: string;
  organizationAddress: string;
  state: string;
  country: string;
  gstin: string;
  gstinNo: string;
  panNo: string;
  pincode: number;
  remarks: string;
  organizationCategory: string;
}
