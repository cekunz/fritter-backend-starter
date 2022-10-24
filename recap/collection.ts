import type {HydratedDocument, Types} from 'mongoose';
import type {Recap} from './model';
import RecapModel from './model';
import LikeCollection from '../likes/collection';
import FollowCollection from '../follow/collection';
import UserCollection from '../user/collection';

class RecapCollection {
  /**
   * Create a recap
   *
   * @param {string} userId - The user the recap is built for
   * @param {string} date - The day the recap is built for
   * @return {Promise<HydratedDocument<User>>} - The newly created recap
   */
  static async createRecap(userId: string, date: string): Promise<HydratedDocument<Recap>> {
    const likesByDate = await LikeCollection.findLikesByDay(userId,  date);
    const followingsByDate = await FollowCollection.findFollowingForUserbyDate(userId, date);
    const followersByDate = await FollowCollection.findFollowersForUserbyDate(userId, date);
    const user = await UserCollection.findOneByUserId(userId);

    const recap = new RecapModel({user: user, 
                                  date: date, 
                                  likes: likesByDate, 
                                  followings: followingsByDate, 
                                  followers: followersByDate});
    
    await recap.save();

    return recap
 }

  /**
   * Get a recap
   *
   * @param {string} userId - The user the recap is built for
   * @param {string} date - The day the recap is built for
   * @return {Promise<HydratedDocument<User>>} - The newly created recap
   */
   static async getRecap(userId: string, date: string): Promise<Recap> {
    const user = await UserCollection.findOneByUserId(userId);
    const recapList: Recap[] = await RecapModel.find({user: user, date: date})

    if (recapList.length === 0) {
        const recap: Recap = await this.createRecap(userId, date);
        return recap;
    } else {
        return recapList[0];
    }
 }
 

 
}

export default RecapCollection;
