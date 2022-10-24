import type {Request, Response, NextFunction} from 'express';
import FollowCollection from './collection';


/**
 * Checks if a user is trying to follow themselves
 */
 const isSelfFollow = (req: Request, res: Response, next: NextFunction) => {
    const following = req.query.userId;
    const sessionUser = req.session.userId
    if (following === sessionUser) {
        console.log('self follow')
        res.status(406).json({
            error: "You can't follow yourself!"
            });
        return 
    }

    next();
  };
  
/**
 * Checks if the follow trying to be made already exists
 */
 const isAlreadyFollowing = async (req: Request, res: Response, next: NextFunction) => {
    const following = (req.query.userId as string) ?? undefined;
    const sessionUser = ( req.session.userId as string) ?? undefined;
  
    const usersFollowed = await FollowCollection.findUsersFollowed(sessionUser);
    usersFollowed.filter((x) => JSON.stringify(x._id) === following);
    if (usersFollowed.length > 0) {
        res.status(407).json({
            error: 'You already follow this user!'
            });
        return 
    }
    next();
  };
  
/**
 * Checks if the user is trying to unfollow someone they don't follow
 */
 const unfollowWithoutFollow = async (req: Request, res: Response, next: NextFunction) => {
    const following = (req.query.userId as string) ?? undefined;
    const sessionUser = ( req.session.userId as string) ?? undefined;
  
    const usersFollowed = await FollowCollection.findUsersFollowed(sessionUser);
    usersFollowed.filter((x) => JSON.stringify(x._id) === following);
    if (usersFollowed.length === 0) {
        res.status(405).json({
            error: 'You do not follow this user!'
            });
        return 
    }
    next();
  };
  
export {isSelfFollow, isAlreadyFollowing, unfollowWithoutFollow};