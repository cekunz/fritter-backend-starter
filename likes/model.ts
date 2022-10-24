import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';
import type {Freet} from '../freet/model';

/**
 * This file defines the properties stored in a Like
 */

export type Like = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  user: User;
  post: Freet;
  likeDate: string;
};

const LikeSchema = new Schema<Like>({
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  post: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Freet'
  },
  likeDate: {
    type: String,
    required: true,
  }
});

const LikeModel = model<Like>('Like', LikeSchema);
export default LikeModel;
