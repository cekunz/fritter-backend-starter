import type {Request, Response, NextFunction} from 'express';
import moment from 'moment';

const formatDate = (date: Date): string => moment(date).format('MM DD YYYY, h:mm:ss a');

/**
 * Checks if date is valid
 */
 const isDateValid = async (req: Request, res: Response, next: NextFunction) => {
    const startYear: string = req.body.year;
    const startMonth: string = req.body.month;
    const startDay: string = req.body.day;

    let invalid = false;

    if (startYear.length !== 4 || (Number(startYear) === NaN) || Number(startYear) < 0 ) {
        invalid = true;
    } 
    if (!(startMonth.length >= 1 && startMonth.length <= 2) || (Number(startMonth) === NaN) || (Number(startMonth) > 12 || Number(startMonth) <= 0)) {
        invalid = true;
    }
    if (!(startDay.length >= 1 && startDay.length <= 2) || (Number(startDay) === NaN) || (Number(startDay) > 31 || Number(startDay) <= 0)) {
        invalid = true;
    }

    // check if the date input format is right
    if (invalid) {
        res.status(406).json({
            error: {
              InvalidDate: 'The date provided is not a valid date format.'
            }
          });
          return;
    }

     // check that we aren't going into the future 
    const currentDate: string[] = formatDate(new Date()).split(' ');
    console.log(currentDate)
    console.log(startDay, startMonth, startYear)
    if (currentDate[2] >= startYear && currentDate[0] >= startMonth && currentDate[1] >= startDay) {
        next();
    } else {
        res.status(405).json({
            error: {
              InvalidDate: 'The date provided is not available for recap.'
            }
          });
          return;
     }

  };
  
export {isDateValid};