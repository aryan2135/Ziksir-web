export interface User extends Document {
    name: string;
    email: string;
    password: string;
    role: 'admin' | 'user';
};

export interface UserData { 
    name: string; 
    email: string; 
    password: string; 
    role: 'admin' | 'user' 
};