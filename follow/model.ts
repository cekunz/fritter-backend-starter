import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type { User } from 'user/model';

/**
 * This file defines the properties stored in a Follow
 */

// Type definition for Freet on the backend
export type Follow =  {
    _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
    following: User;
    follower: User;
    date: Date;
};

const FollowSchema = new Schema<Follow>({
    following: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    follower: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
})

const FollowModel = model<Follow>('Follow', FollowSchema);
export default FollowModel;
