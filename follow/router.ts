import type {Request, Response} from 'express';
import express from 'express';
import * as userValidator from '../user/middleware';
import * as followValidator from '../follow/middleware';
import type {User} from '../user/model'
import FollowCollection from './collection';

const router = express.Router();

/**
 * Get all followers for a given user
 *
 * @name GET api/follow/followers?userId=id 
 *
 * @return {String[]} - A list of all the users that follow the user, unordered
 * @throws {403} - If the user is not logged in
 * @throws {404} - If the user ID is invalid
 */
router.get(
  '/followers',
  [
    userValidator.isUserLoggedIn,
    userValidator.isUserIDCreated,
  ],
  async (req: Request, res: Response) => {
    const userId = (req.query.userId as string) ?? undefined;
    const followerList: User[] = await FollowCollection.findFollowingForUser(userId);
    res.status(200).json({
    message: 'The followers list was found successfully.',
    followers: followerList}); 
});

/**
 * Get all users a given user follows
 *
 * @name GET api/follow/following?userId=id 
 *
 * @return {String[]} - A list of all the users that user follows, unordered
 * @throws {403} - If the user is not logged in
 * @throws {404} - If the user ID is invalid
 */
 router.get(
    '/following',
    [
      userValidator.isUserLoggedIn,
      userValidator.isUserIDCreated,
    ],
    async (req: Request, res: Response) => {
      const userId = (req.query.userId as string) ?? undefined;
      const followingList: User[] = await FollowCollection.findUsersFollowed(userId);
      res.status(200).json({
      message: 'The following list was found successfully.',
      following: followingList}); 
  });

/**
 * Follow a user
 *
 * @name POST /api/follow/:userId?
 * 
 * @param {userId} - the id for the user being followed
 * 
 * @return {FollowInfo} - The information stored in the follow
 * @throws {403} - If the user is not logged in
 * @throws {404} - If the user ID is invalid
 * @throws {406} - If the user tries to follow themselves 
 * @throws {407} - If the user already follows the one they are requesting
 */
router.post(
    '/:userId?',
    [
        userValidator.isUserLoggedIn,
        userValidator.isUserIDCreated,
        followValidator.isSelfFollow,
        followValidator.isAlreadyFollowing,
    ],
    async (req: Request, res: Response) => {
        const userId = (req.query.userId as string) ?? undefined;
        const followInfo = await FollowCollection.followUser(req.session.userId, userId);
        res.status(200).json({
        message: 'The following was successful.',
        following: followInfo}); 
    }
);

/**
 * Unfollow a user
 *
 * @name DELETE /api/follow/:userId?
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in 
 * @throws {404} - If the userId is not valid
 * @throws {405} - if the user has not followed the user they're trying to unfollow
 */
 router.delete(
    '/:userId?',
    [
      userValidator.isUserLoggedIn,
      userValidator.isUserIDCreated,
      followValidator.isSelfFollow,
      followValidator.unfollowWithoutFollow,
    ],
    async (req: Request, res: Response) => {
        const userId = (req.query.userId as string) ?? undefined;
        const unfollow = await FollowCollection.unfollowUser(req.session.userId, userId);
        if (unfollow) {
            res.status(200).json({
                message: 'The user was unfollowed successfully.'}); 
        } else {
            res.status(404).json({
                message: 'There was an error in unfollowing this user.'}); 
        }
        
    });

export {router as followRouter};