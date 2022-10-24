import type {HydratedDocument, Types} from 'mongoose';
import type {Flag} from './model';
import type {User} from '../user/model';
import UserCollection from '../user/collection';
import { Freet } from '../freet/model';
import FreetCollection from '../freet/collection';
import FlagModel from './model';

/**
 * This files contains a class that has the functionality to explore flags
 * stored in MongoDB.
 */
 class FlagCollection {
    /**
    * Find all flags for a freet
    *
    * @param {string} freetId - The id of the given freet
    * @return {Promise<Flag[]>} - An array of all of the flags associated with the post
    */
     static async getFreetFlags(freetId: Types.ObjectId | string): Promise<Flag[]> {
        const flags: Array<Flag> = await FlagModel.find()
        flags.filter((x) => x._id === freetId);
        return flags;
    }

    /**
    * Add a flag to a freet
    *
    * @param {string} userId - The id of the given user
    * @param {string} freetId - The id of the given freet
    * @param {string} flagType - the type of flag associated with the post content
    * @return {Promise<Flag>} - An array of all of the users who follow userID
    */
    static async createFlag(userId: Types.ObjectId | string, freetId: Types.ObjectId | string, flagType: string): Promise<HydratedDocument<Flag>> {
        const user: User = await UserCollection.findOneByUserId(userId);
        const post: Freet = await FreetCollection.findOne(freetId);
        const flag = new FlagModel({post: post, user:user, flagType: flagType})
        await flag.save();
        
        return flag;
    }

    /**
    * Remove a flag from a freet
    *
    * @param {string} userId - The id of the given user
    * @param {string} freetId - The id of the given freet
    * @return {Promise<Boolean>} - An array of all of the users who follow userID
    */
      static async removeFlag(userId: Types.ObjectId | string, freetId: Types.ObjectId | string): Promise<Boolean> {
        const user: User = await UserCollection.findOneByUserId(userId);
        const post: Freet = await FreetCollection.findOne(freetId);
        const flag = await FlagModel.deleteMany({user:user, post: post});
        return flag !== null;
    }

    /**
    * Modify flag on a freet
    *
    * @param {string} freetId - The id of the given freet
    * @return {Promise<Flag>} - An array of all of the flags associated with the post
    */
     static async updateFlagType(userId: Types.ObjectId | string, freetId: Types.ObjectId | string, flagType: string): Promise<Flag> {
        const user: User = await UserCollection.findOneByUserId(userId);
        const post: Freet = await FreetCollection.findOne(freetId);
        const flag = await FlagModel.findOne({user: user, post:post});
        flag.flagType = flagType;
        await flag.save()

        return flag;
    }


}
export default FlagCollection