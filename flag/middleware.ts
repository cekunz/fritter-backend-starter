import type {Request, Response, NextFunction} from 'express';
import {ObjectId, Types} from 'mongoose';
import type {Flag} from './model';
import FlagCollection from './collection';
/**
 * Checks if the user is trying to unfollow someone they don't follow
 */
 const unflagWithoutFlagging = async (req: Request, res: Response, next: NextFunction) => {
    const freetId = (req.params.freetId as string) ?? undefined;
    const sessionUser = ( req.session.userId as string) ?? undefined;
  
    const freetFlags: Flag[] = await FlagCollection.getFreetFlags(freetId);
    freetFlags.filter((x) => JSON.stringify(x.user._id) === sessionUser);
    if (freetFlags.length === 0) {
        res.status(405).json({
            error: "You haven't flagged this post!"
            });
        return 
    }
    next();
  };
  

  export {unflagWithoutFlagging}