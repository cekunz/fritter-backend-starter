import type {HydratedDocument, Types} from 'mongoose';
import type {Follow} from './model';
import FollowModel from './model';
import type {User} from '../user/model';
import UserCollection from '../user/collection';
import FreetModel, { Freet } from '../freet/model';
import FreetCollection from '../freet/collection';
import { formatDate } from '../likes/util';

/**
 * This files contains a class that has the functionality to explore likes
 * stored in MongoDB, including adding and deleting likes.
 */
 class FollowCollection {
    /**
    * Get all the users that follow a specific user
    *
    * @param {string} userId - The id of the given user
    * @return {Promise<Array<User>>} - An array of all of the users who follow userID
    */
    static async findFollowingForUser(userId: Types.ObjectId | string): Promise<Array<User>> {
        const user: User = await UserCollection.findOneByUserId(userId);
        const followerList: Array<Follow> = await FollowModel.find({following: user});
        const followerUsers = followerList.map((x) => x.follower);
        return followerUsers
    }

    /**
    * Get all the users that follow a specific user on a specific day
    *
    * @param {string} userId - The id of the given user
    * @return {Promise<Array<Follow>>} - An array of all of the users who follow userID
    */
     static async findFollowersForUserbyDate(userId: Types.ObjectId | string, date:string): Promise<Array<Follow>> {
        const user: User = await UserCollection.findOneByUserId(userId);
        const followingList: Follow[] = await FollowModel.find({following: user});
        if (followingList.length === 0) return [];

        const dayFollows: Follow[] = followingList.filter((x) => {
                const substrings = x.date.split(',');
                return (substrings[0] === date);
        });

        return dayFollows
    }

    /**
    * Get all the users that a user followed on a specific day
    *
    * @param {string} userId - The id of the given user
    * @return {Promise<Array<Follow>>} - An array of all of the users who follow userID
    */
     static async findFollowingForUserbyDate(userId: Types.ObjectId | string, date:string): Promise<Array<Follow>> {
        const user: User = await UserCollection.findOneByUserId(userId);
        const followerList: Follow[] = await FollowModel.find({follower: user});
        if (followerList.length === 0) return [];

        const dayFollows: Follow[] = followerList.filter((x) => {
                const substrings = x.date.split(',');
                return (substrings[0] === date);
        });

        return dayFollows
    }

    /**
    * Get all the users that a specific user follows
    *
    * @param {string} userId - The id of the given user
    * @return {Promise<Array<User>>} - An array of all of the users who the user associated with UserId follows
    */
     static async findUsersFollowed(userId: Types.ObjectId | string): Promise<Array<User>> {
        const user: User = await UserCollection.findOneByUserId(userId);
        const followingList: Array<Follow> = await FollowModel.find({follower: user});
        const followingUsers = followingList.map((x) => x.following);
        return followingUsers
    }

    /**
     * Follow a user
     *
     * @param {string} followerUserId - The id of the user making the follow
     * @param {string} followingUserId - the Id of the user to follow
     * @return {Promise<{ following: string; follower: string; date: Date; }>} - The new follow information
     */
    static async followUser(followerUserId: string, followingUserId: string): Promise<{ following: string; follower: string; date: string; }> {
        const followingUser = await UserCollection.findOneByUserId(followerUserId);
        const followedUser = await UserCollection.findOneByUserId(followingUserId);
        const followTime = formatDate(new Date()); // use one single date for both the following/being followed

        const newFollow = new FollowModel({following:followedUser, follower: followingUser, date:followTime});
        await newFollow.save();  // save to DB

        const followReturnObj = {"following": followedUser.username, "follower": followingUser.username, "date": followTime}
        return followReturnObj;
    }

    /**
     * Unfollow a user
     *
     * @param {string} followerUserId - The id of the user making the follow
     * @param {string} followingUserId - the Id of the user to follow
     * @return {Promise<Boolean>} - true if the user has been deleted, false otherwise
     */
     static async unfollowUser(followerUserId: string, followingUserId: string): Promise<boolean> {
        const followingUser = await UserCollection.findOneByUserId(followerUserId);
        const followedUser = await UserCollection.findOneByUserId(followingUserId);

        const follow = await FollowModel.deleteMany({following:followedUser, follower: followingUser})
        return follow !== null;
    }
}
export default FollowCollection