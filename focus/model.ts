import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';
import { User } from '../user/model';

/**
 * This file defines the properties stored in a Focus
 */

export type Focus =  {
    _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
    user: User
    name: string;
    features: string;
};

const FocusSchema = new Schema<Focus>({
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    name: {
        type: String,
        required: true,
    },
    features: {
        type: String,
        required: true,
    },
})

const FocusModel = model<Focus>('Focus', FocusSchema);
export default FocusModel;
