import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import LikeCollection from '../likes/collection';
import * as userValidator from '../user/middleware';
import * as freetValidator from '../freet/middleware';
import * as recapValidator from './middleware';
// import * as likeValidator from './middleware';
// import * as util from './util';
import {Freet} from '../freet/model';
import type {Like} from  '../likes/model'
import { formatDate } from '../likes/util';
import RecapCollection from './collection';
import type {Recap} from './model';

const router = express.Router();

const months = new  Map<string, string>([['1', 'January'],['2','February'],
                                        ['3', 'March'], ['4', 'April'], 
                                        ['5', 'May'], ['6', 'June'],
                                         ['7', 'July'],['8', 'August'],
                                         ['9', 'Septempber'],['10', 'October'],
                                         ['11', 'November'],['12', 'December']])

const endings = new  Map<string, string>([['1', 'st'],['2','nd'],
                                            ['3', 'rd'], ['4', 'th'], 
                                            ['5', 'th'], ['6', 'th'],
                                            ['7', 'th'],['8', 'th'],
                                            ['9', 'th'],['0', 'th']])

function formatDateString(year: string, month: string, day:string): string {
    const monthString = months.get(month);
    const dayString = day + endings.get(day[day.length-1]); // get proper day ending
    return `${monthString} ${dayString} ${year}`;
}    

/**
 * Get/create a recap for a given date range
 *
 * @name POST api/recap
 *
 * @return {Recap} - A recap object for the dates being requested
 * @throws {403} - If the user is not logged in
 */
router.post(
  '/', 
  [
    userValidator.isUserLoggedIn,
    recapValidator.isDateValid,
  ],
  async (req: Request, res: Response) => {
    const startYear: string = req.body.year;
    const startMonth: string = req.body.month;
    const startDay: string = req.body.day;
    const userId = req.session.userId;
    const formattedDate = formatDateString(startYear, startMonth, startDay);

    const recap: Recap = await RecapCollection.getRecap(userId, formattedDate)
    
    res.status(200).json({
        message: 'The recap was connected successfully.',
        recap: recap})
   
});

export {router as recapRouter};