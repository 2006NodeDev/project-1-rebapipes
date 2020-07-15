import express, { Request, Response, NextFunction } from 'express'
import { getBookingByUserId } from '../daos/SQL/booking-dao'
import { authorizationMiddleware } from '../middleware/authorization-middleware'

export const bookingAuthorRouter = express.Router()

// Find Booking by User Id
bookingAuthorRouter.get('/:userId', authorizationMiddleware(['Admin', 'User', 'Current']), async (req:Request, res:Response, next:NextFunction) => {
    let { userId } = req.params
    if(isNaN(+userId)) {
        res.status(400).send('Id must be a number')
    }
    else { 
        try {
            let bookingByUserId = await getBookingByUserId(+userId)
            res.json(bookingByUserId)
        } catch (e) {
            next(e)
        }
    }
})
