import type {Request, Response, NextFunction} from 'express';
import UserCollection from '../user/collection';
import FocusModel from './model';

/**
 * Checks the setting exists
 */
 const isSettingExists = async (req: Request, res: Response, next: NextFunction) => {
    const sessionUser = ( req.session.userId as string) ?? undefined;
    const settingName = (req.query.name as string) ?? undefined;

    const user = await UserCollection.findOneByUserId(sessionUser);

    const focus = await FocusModel.find({user: user, name: settingName});
    
    console.log('here',focus)
    if (focus.length === 0) {
        res.status(405).json({
            error: "This focus setting doesn't exist!"
        })
        return;
    }
    next();
  };

/**
 * Checks if no setting by the name exists
 */
 const isSettingAlreadyExists = async (req: Request, res: Response, next: NextFunction) => {
    const sessionUser = ( req.session.userId as string) ?? undefined;
    const settingName = (req.query.name as string) ?? undefined;

    const user = await UserCollection.findOneByUserId(sessionUser);

    const focus = await FocusModel.find({user: user, name: settingName});
    
    if (focus.length > 0) {
        res.status(405).json({
            error: "This focus setting already exists!"
        })
        return;
    }
    next();
  };

  export {isSettingExists, isSettingAlreadyExists}