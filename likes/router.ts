import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import LikeCollection from './collection';
import * as userValidator from '../user/middleware';
import * as freetValidator from '../freet/middleware';
import * as util from './util';
import {Freet} from '../freet/model';

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
 * Send a like
 *
 * @name POST /api/freets/:freetId?
 * 
 * @param {freetId} - the id for the freet being liked
 * 
 * @return {FreetResponse} - The modified freet
 * @throws {403} - If the user is not logged in
 * @throws {404} - If the freet ID is invalid
 */
router.post(
  '/:freetId?',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists,
  ],
  async (req: Request, res: Response) => {
    const freetId = (req.params.freetId as string) ?? undefined;
    const likerId = req.session.userId;
    if (freetId !== undefined) {
        const updatedFreet: Freet = await LikeCollection.addLike(freetId, likerId);
        res.status(200).json({
            message: 'The like was added successfully.',
            freet: updatedFreet});
    } 
  }
);

/**
 * Delete a like
 *
 * @name DELETE /api/freets?freetId=id
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in 
 * @throws {404} - If the freetId is not valid
 * @throws {409} - if the user has not liked the freet
 */
router.delete(
  '/:freetId?',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists,
  ],
  async (req: Request, res: Response) => {
    const freetId = (req.params.freetId as string) ?? undefined;
    const likerId = req.session.userId;
    if (freetId !== undefined) {
        const updatedFreet: Freet|undefined = await LikeCollection.removeLike(freetId, likerId);
        if (updatedFreet === undefined) {
            res.status(409).json({
                message: 'You have not liked this post yet!'});
        } else {
            res.status(200).json({
                message: 'The like was removed successfully.',
                freet: updatedFreet});
        }
        
    }
  }
);

// /**
//  * Modify a freet
//  *
//  * @name PUT /api/freets/:id
//  *
//  * @param {string} content - the new content for the freet
//  * @return {FreetResponse} - the updated freet
//  * @throws {403} - if the user is not logged in or not the author of
//  *                 of the freet
//  * @throws {404} - If the freetId is not valid
//  * @throws {400} - If the freet content is empty or a stream of empty spaces
//  * @throws {413} - If the freet content is more than 140 characters long
//  */
// router.put(
//   '/:freetId?',
//   [
//     userValidator.isUserLoggedIn,
//     freetValidator.isFreetExists,
//     freetValidator.isValidFreetModifier,
//     freetValidator.isValidFreetContent
//   ],
//   async (req: Request, res: Response) => {
//     const freet = await FreetCollection.updateOne(req.params.freetId, req.body.content);
//     res.status(200).json({
//       message: 'Your freet was updated successfully.',
//       freet: util.constructFreetResponse(freet)
//     });
//   }
// );

export {router as likesRouter};
