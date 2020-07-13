import express, { Request, Response, NextFunction } from 'express'
import { getReimbursementByStatus } from '../daos/booking-dao'
import { authorizationMiddleware } from '../middleware/authorization-middleware'

export const reimbursementStatusRouter = express.Router()

//Find Reimbursement By Status 
reimbursementStatusRouter.get('/:statusId', authorizationMiddleware(['Admin', 'Finance Manager']), async (req:Request, res:Response, next:NextFunction) => {
    let { statusId } = req.params
    if(isNaN(+statusId)) {
        res.status(400).send('Status Id must be a number')
    }
    else { 
        try {
            let reimById = await getReimbursementByStatus(+statusId)
            res.json(reimById)
        } catch (e) {
            next(e)
        }
    }
})
