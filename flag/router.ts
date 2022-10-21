
import type {NextFunction, Request, Response} from 'express';
import express from 'express';
// import LikeCollection from './collection';
import * as userValidator from '../user/middleware';
import * as freetValidator from '../freet/middleware';
import * as flagValidator from './middleware';
// import * as util from './util';
// import {Freet} from '../freet/model';
import type {Flag} from './model'
import FlagCollection from './collection';

const router = express.Router();

router.get(
    '/',
    async (req: Request, res: Response) => {
        const freetId = (req.body.id as string) ?? undefined;
        const flags: Flag[] = await FlagCollection.getFreetFlags(freetId);
        res.status(200).json({
          message: 'The flags were successfully found.',
          flags: flags});
        } 
  
);


/**
 * Flag a post
 *
 * @name POST /api/flag/:freetId?
 * 
 * @param {freetId} - the id for the freet being flagged
 * 
 * @return {Flag} - The flag object created
 * @throws {403} - If the user is not logged in
 * @throws {404} - If the freet ID is invalid
 */
 router.post(
    '/',
    [
      userValidator.isUserLoggedIn,
      freetValidator.isFreetExistsBody,
    ],
    async (req: Request, res: Response) => {
      const freetId = (req.body.id as string) ?? undefined;
      const flaggerId = req.session.userId;
      const flagType = req.body.content;
      
      const flag: Flag = await FlagCollection.createFlag(flaggerId, freetId, flagType);
      res.status(200).json({
        message: 'The flag was added successfully.',
        flag: {post: flag.post._id, postContent: flag.post.content, flagType: flag.flagType, user: flag.user.username}});
      } 
    
  );

  /**
 * Delete a flag
 *
 * @name DELETE /api/flag?freetId=id
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in 
 * @throws {404} - If the freetId is not valid
 * @throws {409} - if the user has not flagged the freet
 */
router.delete(
    '/',
    [
      userValidator.isUserLoggedIn,
      freetValidator.isFreetExistsBody,
      flagValidator.unflagWithoutFlagging,
    ],
    async (req: Request, res: Response) => {
      const freetId = (req.body.id as string) ?? undefined;
      const flaggerId = req.session.userId;
      const removedFlag = await FlagCollection.removeFlag(flaggerId, freetId);
      if (removedFlag) {
        res.status(200).json({
            message: 'The post was unflagged successfully.'}); 
      } else {
        res.status(404).json({
            message: 'There was an error in removing the flag from this post.'}); 
      }
        
    });
  

export {router as flagRouter};