import type {Request, Response} from 'express';
import express from 'express';
import * as userValidator from '../user/middleware';
import * as focusValidator from './middleware'
import FocusCollection from './collection';

const router = express.Router();

/**
 * Get all focus settings made by user
 *
 * @name GET /api/focus
 * 
 * @return {Focus[]} - all associated focus objects
 * @throws {403} - If the user is not logged in
 */
 router.get(
    '/',
    [
      userValidator.isUserLoggedIn,
    ],
    async (req: Request, res: Response) => {
        const userId = req.session.userId;
        const focus = await FocusCollection.getSetting(userId);
        res.status(200).json({
          message: 'The settings were found successfully.',
          focus: focus});
        } 
);

/**
 * Create new focus setting
 *
 * @name POST /api/focus?name=name
 * 
 * @param {content} - the id for the freet being flagged
 * 
 * @return {Focus} - The new focus object
 * @throws {403} - If the user is not logged in
 * @throws {405} - if that name is already taken
 */
router.post(
    '/',
    [
      userValidator.isUserLoggedIn,
      focusValidator.isSettingAlreadyExists,
    ],
    async (req: Request, res: Response) => {
        const userId = req.session.userId;
        const name = (req.query.name as string) ?? undefined;
        const settings = req.body.features;
        const focus = await FocusCollection.createSetting(userId, name, settings);
        res.status(200).json({
          message: 'The setting was successfully created.',
          focus: focus});
        } 
);

/**
 * Delete a focus setting
 *
 * @name DELETE /api/focus?name=name
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in 
 * @throws {405} - if the setting does not ecxist
 */
 router.delete(
    '/',
    [
      userValidator.isUserLoggedIn,
      focusValidator.isSettingExists
    ],
    async (req: Request, res: Response) => {
        const userId = req.session.userId;
        const name = (req.query.name as string) ?? undefined;

        const deleteFocus = await FocusCollection.deleteSetting(userId, name);
        if (deleteFocus) {
            res.status(200).json({
                message: 'The setting was deleted successfully.'}); 
        } else {
            res.status(404).json({
                message: 'There was an error in deleting this setting.'}); 
        }
        
    });
  

export {router as focusRouter};