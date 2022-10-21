import type {HydratedDocument, Types} from 'mongoose';
import type {Like} from './model';
import LikeModel from './model';
import type {User} from '../user/model';
import UserCollection from '../user/collection';
import FreetModel, { Freet } from '../freet/model';
import FreetCollection from '../freet/collection';

/**
 * This files contains a class that has the functionality to explore likes
 * stored in MongoDB, including adding and deleting likes.
 */
 class LikeCollection {
    /**
    * Get all the likes for a given Freet
    *
    * @param {string} freetId - The id of the given freet
    * @return {Promise<Array<string>>} - An array of all of the users who have liked the Freet 
    */
    static async findLikesByFreet(freetId: Types.ObjectId | string | undefined): Promise<Array<string>> {
        const freet: Freet = await FreetCollection.findOne(freetId);
        return freet.likes;
    }

    /**
     * Add a like to the collection
     *
     * @param {Freet} post - the post that the like is being applied to
     * @param {string} authorId - The id of the user liking the freet
     * @return {Promise<HydratedDocument<Freet>>} - The modified freet
     */
    static async addLike(freetId: string, likerId: string): Promise<HydratedDocument<Freet>> {
        const freet = await FreetModel.findOne({_id: freetId});
        const liker: User = await UserCollection.findOneByUserId(likerId);
        const likes = freet.likes;
        if (!likes.includes(liker.username)) {
            likes.push(liker.username);
            freet.likes = likes;
            await freet.save();
        }
        return freet;
    }

    /**
     * Removes a like to the collection if the like is on the post
     *
     * @param {Freet} freetId - the post that the like is being applied to
     * @param {string} likerId - The id of the user liking the freet
     * @return {Promise<HydratedDocument<Freet>>} - The modified freet
     */
     static async removeLike(freetId: string, likerId: string): Promise<HydratedDocument<Freet>> {
         const freet = await FreetModel.findOne({_id: freetId});
        const liker: User = await UserCollection.findOneByUserId(likerId);
        const likes = freet.likes;
        if (likes.includes(liker.username)) {
            const index = likes.indexOf(liker.username);
            if (index > -1) {
                likes.splice(index, 1);
              }
            freet.likes = likes;
            await freet.save();
            return freet;
        } else return undefined
        
    }
}
export default LikeCollection