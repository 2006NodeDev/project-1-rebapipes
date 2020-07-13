import { Booking } from "../models/booking";
import { PoolClient } from "pg";
import { connectionPool } from ".";
import { BookingDTOtoBookingConverter } from "../utils/Booking-DTO-to-Booking-converter";
import { BookingNotFoundError } from "../errors/BookingNotFoundError";
import { BookingInputError } from "../errors/BookingInputError";

// Get all Bookings
export async function getAllBookings():Promise<Booking[]> {
    let client:PoolClient
    try {
        client = await connectionPool.connect()
        let results = await client.query(`select b."booking_id", 
                                                b."venue", 
                                                b."payment", 
                                                b."gig_date",
                                                b."date_submitted", 
                                                b."date_resolved", 
                                                b."description",  
                                                bs."status",
                                                bs."status_id",
                                                bt."type",
                                                bt."type_id" from roadey.bookings b
                                            left join roadey.booking_statuses bs
                                                on b."status" = bs."status_id"
                                            left join roadey.booking_types bt
                                                on b."type" = bt."type_id"
                                            order by b.date_submitted;`)
        return results.rows.map(BookingDTOtoBookingConverter)
    } catch (e) {
        console.log(e);
        throw new Error('Unhandled Error Occured')
    } finally {
        client && client.release()
    }
}

// Find Booking(s) by Status
export async function getBookingByStatus(status:number):Promise<Booking[]> {
    let client:PoolClient
    try {
        client = await connectionPool.connect()
        let results = await client.query(`select b."booking_id", 
                                                b."venue", 
                                                b."payment", 
                                                b."gig_date",
                                                b."date_submitted",
                                                b."date_resolved",
                                                b."description",
                                                bs."status_id", 
                                                bs."status",
                                                bt."type_id",
                                                bt."type"
                                                    from roadey.bookings b
                                            left join roadey.booking_statuses bs
                                                on b."status" = bs."status_id" 
                                            left join roadey.booking_types bt
                                                on b."type" = bt."type_id"
                                                    where b."status" = $1
                                            order by b.date_submitted;`, [status])
        if(results.rowCount === 0) {
            throw new Error('Booking Not Found')
        }
        return results.rows.map(BookingDTOtoBookingConverter);
    } catch (e) {
        if(e.message === 'Booking Not Found') {
            throw new BookingNotFoundError()
        }
        console.log(e);
        throw new Error('Unknown Error Occured')
    } finally {
        client && client.release()
    }
}


// Find Booking(s) by User
export async function getBookingByUserId(userId:number):Promise<Booking[]> {
    let client:PoolClient
    try {
        client = await connectionPool.connect()
        let results = await client.query(`select b."booking_id", 
                                                b."venue", b."payment",
                                                b."gig_date", 
                                                b."date_submitted",
                                                b."date_resolved",
                                                b."description", 
                                                bs."status_id", bs."status",
                                                bt."type_id", bt."type"
                                            from roadey.bookings b
                                            left join roadey.booking_statuses bs
                                                on b."status" = bs."status_id" 
                                            left join roadey.booking_types bt
                                                on b."type" = bt."type_id"
                                            left join roadey.users u 
                                                on b."author" = u."user_id"
                                                    where u."user_id" = $1
                                            order by b.date_submitted;`, [userId])
        if(results.rowCount === 0) {
            throw new Error('Booking Not Found')
        }
        return results.rows.map(BookingDTOtoBookingConverter);
    } catch (e) {
        if(e.message === 'Booking Not Found') {
            throw new BookingNotFoundError()
        }
        console.log(e);
        throw new Error('Unknown Error Occured')
    } finally {
        client && client.release()
    }
}


// Submit a Booking
export async function submitOneBooking(newReimbursement:Booking):Promise<Booking> {
    let client:PoolClient
    try {
        client = await connectionPool.connect()
        await client.query('BEGIN;')
        let typeId = await client.query(`select t."type_id" from roadey.reimbursement_types t 
                                            where t."type" = $1;`,
                                        [newBooking.type])
        if(typeId.rowCount === 0) {
            throw new Error('Type Not Found')
        }
        typeId = typeId.rows[0].type_id 
        
        let results = await client.query(`insert into roadey.reimbursements ("author", "amount", 
                                        "date_submitted", "description", "status", "type")
                                            values($1,$2,$3,$4,$5,$6) 
                                        returning "reimbursement_id";`,
                                        [newReimbursement.author, newReimbursement.amount, newReimbursement.dateSubmitted,
                                            newReimbursement.description, newReimbursement.status.statusId, typeId]) 
        newReimbursement.reimbursementId = results.rows[0].reimbursement_id
        
        await client.query('COMMIT;')
        return newReimbursement
    } catch (e) {
        client && client.query('ROLLBACK;')
        if(e.message === 'Type Not Found' || e.message === 'Status Not Found') {
            throw new BookingInputError()
        } 
        console.log(e);
        throw new Error('Unknown Error Occured')
    } finally {
        client && client.release()
    }
}


// Update a Booking
export async function updateOneReimbursement(updatedOneReimbursement:Booking):Promise<Booking> {
    let client:PoolClient
    try {
        client = await connectionPool.connect()
        await client.query('BEGIN;')

        if(updatedOneReimbursement.author) {
            await client.query(`update roadey.reimbursements set "author" = $1 
                                where "reimbursement_id" = $2;`, 
                                [updatedOneReimbursement.author, updatedOneReimbursement.reimbursementId])
        }
        if(updatedOneReimbursement.amount) {
            await client.query(`update roadey.reimbursements set "amount" = $1 
                                where "reimbursement_id" = $2;`, 
                                [updatedOneReimbursement.amount, updatedOneReimbursement.reimbursementId])
        }
        if(updatedOneReimbursement.dateSubmitted) {
            await client.query(`update roadey.reimbursements set "date_submitted" = $1 
                                where "reimbursement_id" = $2;`, 
                                [updatedOneReimbursement.dateSubmitted, updatedOneReimbursement.reimbursementId])
        }
        if(updatedOneReimbursement.dateResolved) {
            await client.query(`update roadey.reimbursements set "date_resolved" = $1 
                                where "reimbursement_id" = $2;`, 
                                [updatedOneReimbursement.dateResolved, updatedOneReimbursement.reimbursementId])
        }
        if(updatedOneReimbursement.description) {
            await client.query(`update roadey.reimbursements set "description" = $1 
                                where "reimbursement_id" = $2;`, 
                                [updatedOneReimbursement.description, updatedOneReimbursement.reimbursementId])
        }
        if(updatedOneReimbursement.resolver) {
            await client.query(`update roadey.reimbursements set "resolver" = $1 
                                where "reimbursement_id" = $2;`, 
                                [updatedOneReimbursement.resolver, updatedOneReimbursement.reimbursementId])
        }
        if(updatedOneReimbursement.status) {
            let statusId = await client.query(`select rs."status_id" from roadey.reimbursement_statuses rs 
                                            where rs."status" = $1;`, [updatedOneReimbursement.status])
            if(statusId.rowCount === 0) {
                throw new Error('Status Not Found')
            }
            statusId = statusId.rows[0].status_id
            await client.query(`update roadey.reimbursements set "status" = $1 
                                where "reimbursement_id" = $2;`, 
                                [statusId, updatedOneReimbursement.reimbursementId])
        }
        if(updatedOneReimbursement.type) {
            let typeId = await client.query(`select rt."type_id" from roadey.reimbursement_types rt 
                                            where rt."type" = $1;`, [updatedOneReimbursement.type])
            if(typeId.rowCount === 0) {
                throw new Error('Type Not Found')
            }
            typeId = typeId.rows[0].type_id
            await client.query(`update roadey.reimbursements set "type" = $1 
                                where "reimbursement_id" = $2;`, 
                                [typeId, updatedOneReimbursement.reimbursementId])
        }

        await client.query('COMMIT;')
        return updatedOneReimbursement
    } catch(e) {
        client && client.query('ROLLBACK;')
        if(e.message == 'Status Not Found' || e.message == 'Type Not Found') {
            throw new ReimbursementInputError()
        }
        console.log(e);
        throw new Error('Unknown Error Occured')
    } finally {
        client && client.release()
    }
}
