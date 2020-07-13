import express, { Request, Response, NextFunction } from 'express'
import { getBookingByStatus } from '../daos/booking-dao'
import { authorizationMiddleware } from '../middleware/authorization-middleware'

export const bookingStatusRouter = express.Router()

//Find Booking By Status 
bookingStatusRouter.get('/:statusId', authorizationMiddleware(['Admin', 'User', 'Current']), async (req:Request, res:Response, next:NextFunction) => {
    let { statusId } = req.params
    if(isNaN(+statusId)) {
        res.status(400).send('Status Id must be a number')
    }
    else { 
        try {
            let bookingById = await getBookingByStatus(+statusId)
            res.json(bookingById)
        } catch (e) {
            next(e)
        }
    }
})
