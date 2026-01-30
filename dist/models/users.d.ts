import mongoose, { Document } from 'mongoose';
export interface IUser extends Document {
    userType: 'customer' | 'supermarket_owner';
    name: string;
    email: string;
    phone: string;
    password: string;
    role: 'user' | 'admin';
    isVerified: boolean;
    isActive: boolean;
    supermarketName?: string;
    location?: {
        type: 'Point';
        coordinates: [number, number];
        address?: string;
    };
    businessLicense?: string;
    description?: string;
    image_url?: string;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}
declare const _default: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser, {}, {}> & IUser & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=users.d.ts.map