import type {Request, Response} from 'express';
import express from 'express';
import LikeCollection from './collection';
import * as userValidator from '../user/middleware';
import * as freetValidator from '../freet/middleware';
import * as likeValidator from './middleware';
import type {Like} from  '../likes/model'

const router = express.Router();

/**
 * Get all likes for a given Freet
 *
 * @name GET api/likes?freetId=id 
 *
 * @return {String[]} - A list of all the users that liked a freet, unordered
 * @throws {403} - If the user is not logged in
 * @throws {404} - If the freet ID is invalid
 */
router.get(
  '/',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExistsQuery,
  ],
  async (req: Request, res: Response) => {
    const freetId = (req.query.freetId as string) ?? undefined;
    if (freetId !== undefined) {
        const likes = await LikeCollection.findLikesByFreet(freetId);
        res.status(200).json({
            message: 'The likes were found successfully.',
            likes: likes});
    } else {
        res.status(404)
    } 
});

/**
 * Send a like to a freet
 *
 * @name POST /api/likes?freetId=id
 * 
 * @param {freetId} - the id for the freet being liked
 * 
 * @return {Like} - The created like object
 * @throws {403} - If the user is not logged in
 * @throws {404} - If the freet ID is invalid
 * @throws {405} - If the user has already liked theh freet
 */
router.post(
  '/:freetId?',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists,
    likeValidator.isDoubleLike,
  ],
  async (req: Request, res: Response) => {
    const freetId = (req.params.freetId as string) ?? undefined;
    const likerId = req.session.userId;
    const like: Like = await LikeCollection.addLike(freetId, likerId);
    res.status(200).json({
        message: 'The like was added successfully.',
        like: {freetId: like._id, likeDate: like.likeDate}});
    } 
);

/**
 * Delete a like
 *
 * @name DELETE /api/likes?freetId=id
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in 
 * @throws {404} - If the freetId is not valid
 * @throws {405} - if the user has not liked the freet
 */
router.delete(
  '/:freetId?',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists,
    likeValidator.unlikeWithoutLike,
  ],
  async (req: Request, res: Response) => {
    const freetId = (req.params.freetId as string) ?? undefined;
    const likerId = req.session.userId;
    const unlike = await LikeCollection.removeLike(freetId, likerId);
    if (unlike) {
        res.status(200).json({
            message: 'The freet was unliked successfully.'}); 
    } else {
        res.status(404).json({
            message: 'There was an error in unliking this freet.'}); 
    }  
  }
);

export {router as likesRouter};
