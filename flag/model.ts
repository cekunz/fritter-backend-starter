import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type { User } from 'user/model';
import type { Freet } from 'freet/model';

/**
 * This file defines the properties stored in a Flag
 */


// Type definition for Freet on the backend
export type Flag =  {
    _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
    post: Freet;
    user: User;
    flagType: string;
};

const FlagSchema = new Schema<Flag>({
    post: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Freet'
    },
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    flagType: {
        type: String,  
        required: true
    }
})

const FlagModel = model<Flag>('Flag', FlagSchema);
export default FlagModel;
