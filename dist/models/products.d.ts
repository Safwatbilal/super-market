import mongoose, { Document } from 'mongoose';
export interface ISize {
    name: string;
    weight: number;
    price: number;
}
export interface IProduct extends Document {
    name: string;
    category_id: mongoose.Types.ObjectId;
    image_url?: string;
    weight?: number;
    currency: 'USD' | 'SAR' | 'SYP';
    price?: number;
    sizes?: ISize[];
    status: 'published' | 'unpublished';
    is_featured: boolean;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IProduct, {}, {}, {}, mongoose.Document<unknown, {}, IProduct, {}, {}> & IProduct & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=products.d.ts.map