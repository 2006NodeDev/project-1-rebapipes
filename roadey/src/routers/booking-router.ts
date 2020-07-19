import express, { Request, Response, NextFunction } from 'express'
import { UserInputError } from '../errors/UserInputError'
import { bookingStatusRouter } from './booking-status-router'
import { bookingAuthorRouter } from './booking-author-router'
import { Booking } from '../models/booking'
import { submitOneBooking, updateOneBooking, getAllBookings } from '../daos/SQL/booking-dao'
import { authenticationMiddleware } from '../middleware/authentication-middleware'
import { authorizationMiddleware } from '../middleware/authorization-middleware'

export const bookingRouter = express.Router()

bookingRouter.use(authenticationMiddleware)
//Redirect all requests on /booking/status to booking-status-router
bookingRouter.use('/status', bookingStatusRouter)
//Redirect all requests on /booking/author/userId to booking-author-router
bookingRouter.use('/author/userId', bookingAuthorRouter)

//Get All Bookings
bookingRouter.get('/', authorizationMiddleware(['Admin', 'User', 'Current']), async (req:Request, res:Response, next:NextFunction) => { 
    try {
        let allReims = await getAllBookings()
        res.json(allReims)
    } catch (e) {
        next(e)
    }
})

//Submit Booking
bookingRouter.post('/', authorizationMiddleware(['Admin', 'User', 'Current']), async (req:Request, res:Response, next:NextFunction) => {
    console.log(req.body);
    let { 
        author,
        venue,
        payment,
        gigDate,
        dateSubmitted,
        description,
        type } = req.body
    if(author && payment && dateSubmitted && description && type) {
        let newBooking: Booking = {
            bookingId: 0,
            author,
            venue,
            payment,
            gigDate,
            dateSubmitted,
            dateResolved: null,
            description,
            status: //status is automatically 1:"Pending"
                {
                    status: 'Pending',
                    statusId: 1
                },
            type
        }
        newBooking.type = type || null
        try {
            let savedBooking = await submitOneBooking(newBooking)
            res.json(savedBooking)
        } catch (e) {
            next(e)
        }
    }
    else {
        throw new UserInputError()
    }
})

//Update Booking, we assume Admin has userId for each user
bookingRouter.patch('/', authorizationMiddleware(['Admin', 'User', 'Current']), async (req:Request, res:Response, next:NextFunction) => {
    let { bookingId,
        author,
        venue,
        payment,
        gigDate,
        dateSubmitted,
        dateResolved,
        description,
        status,
        type } = req.body
    if(!bookingId) { //update request must contain a bookingId
        res.status(400).send('Please enter a valid booking Id')
    }
    else if(isNaN(+bookingId)) { //check if bookingId is valid
        res.status(400).send('Id must be a number')
    }
    else { 
        let updatedOneBooking:Booking = { 
            bookingId, 
            author,
            venue,
            payment,
            gigDate,
            dateSubmitted,
            dateResolved,
            description,
            status,
            type
        }
        updatedOneBooking.author = author || undefined
        updatedOneBooking.venue = venue || undefined
        updatedOneBooking.payment = payment || undefined
        updatedOneBooking.gigDate = gigDate || undefined
        updatedOneBooking.dateSubmitted = dateSubmitted || undefined
        updatedOneBooking.dateResolved = dateResolved || undefined
        updatedOneBooking.description = description || undefined
        updatedOneBooking.status = status || undefined
        updatedOneBooking.type = type || undefined
        try {
            let results = await updateOneBooking(updatedOneBooking)
            res.json(results)
        } catch (e) {
            next(e)
        }
    }
})
