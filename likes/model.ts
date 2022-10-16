import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';

/**
 * This file defines the properties stored in a Like
 */

// Type definition for Freet on the backend
export type Like = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  likes: Set<string>;
};

const LikeSchema = new Schema<Like>({
  likes: {
    type: [String],
    required: true,
  }
});

const LikeModel = model<Like>('Freet', LikeSchema);
export default LikeModel;
