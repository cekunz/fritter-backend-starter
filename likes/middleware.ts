import {Request, Response, NextFunction, json} from 'express';
import type {User} from '../user/model';
import UserCollection from '../user/collection';
import LikeCollection from './collection';


/**
 * Checks if a user is trying to double-like a post
 */
 const isDoubleLike = async (req: Request, res: Response, next: NextFunction) => {
    const freetId = (req.params.freetId as string) ?? undefined;
    const currentLikes: User[] = await LikeCollection.findLikesByFreet(freetId);
    const liker = await UserCollection.findOneByUserId(req.session.userId);
    const userCurrentLikes = currentLikes.filter((x) => JSON.stringify(x._id) === JSON.stringify(liker._id));
    
    if (userCurrentLikes.length > 0) {
        res.status(405).json({
            message: 'You already liked this freet!'
        });
        return;
    }
    next();
  };
  

/**
 * Checks if a user is trying to remove a like without the like existing
 */
 const unlikeWithoutLike = async (req: Request, res: Response, next: NextFunction) => {
    const freetId = (req.params.freetId as string) ?? undefined;
    const currentLikes: User[] = await LikeCollection.findLikesByFreet(freetId);
    const liker = await UserCollection.findOneByUserId(req.session.userId);
    const userCurrentLikes = currentLikes.filter((x) => JSON.stringify(x._id) === JSON.stringify(liker._id));
    
    if (userCurrentLikes.length === 0) {
        res.status(405).json({
            message: 'You have not liked this freet!'
        });
        return;
    }
    next();
  };
  


export {isDoubleLike, unlikeWithoutLike};