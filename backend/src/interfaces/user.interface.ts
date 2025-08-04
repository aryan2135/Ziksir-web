export interface User extends Document {
    name: string;
    email: string;
    password: string;
    role: 'admin' | 'user';
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
};

export interface UserData { 
    name: string; 
    email: string; 
    password: string; 
    role: 'admin' | 'user';
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
};