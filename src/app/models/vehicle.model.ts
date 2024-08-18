export type VehicleType = 'Microbus' | 'Car' | 'Truck';
export type Status = 'in' | 'out';

export interface Vehicle {
    id?: number;
    licenseNumber: string;
    vehicleType: VehicleType;
    ownerName: string;
    ownerPhone: string;
    status: Status;
    ownerAddress: string;
    entryTime: string;
    exitTime: string;
    parkingCharge: number;
}
