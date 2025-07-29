export interface Equipment extends Document {
    name: string;
    type: string;
    equipmentLocation: string;
    status: 'available' | 'unavailable' | 'maintenance';
    lastMaintenance?: Date;
    createdAt?: Date;
    updatedAt?: Date;
    descriptionFields: Array<{
        key: string;
        value: any;
    }>;
}