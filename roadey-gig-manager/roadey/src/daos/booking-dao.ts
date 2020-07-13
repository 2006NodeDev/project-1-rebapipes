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
export async function submitOneBooking(newBooking:Booking):Promise<Booking> {
    let client:PoolClient
    try {
        client = await connectionPool.connect()
        await client.query('BEGIN;')
        let typeId = await client.query(`select t."type_id" from roadey.booking_types t 
                                            where t."type" = $1;`,
                                        [newBooking.type])
        if(typeId.rowCount === 0) {
            throw new Error('Type Not Found')
        }
        typeId = typeId.rows[0].type_id 
        
        let results = await client.query(`insert into roadey.bookings ("author", "venue", "payment", "gig_date",
                                        "date_submitted", "description", "status", "type")
                                            values($1,$2,$3,$4,$5,$6) 
                                        returning "booking_id";`,
                                        [newBooking.author, newBooking.payment, newBooking.venue, newBooking.gigDate, newBooking.dateSubmitted,
                                            newBooking.description, newBooking.status.statusId, typeId]) 
        newBooking.bookingId = results.rows[0].booking_id
        
        await client.query('COMMIT;')
        return newBooking
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
export async function updateOneBooking(updatedOneBooking:Booking):Promise<Booking> {
    let client:PoolClient
    try {
        client = await connectionPool.connect()
        await client.query('BEGIN;')

        if(updatedOneBooking.author) {
            await client.query(`update roadey.bookings set "author" = $1 
                                where "booking_id" = $2;`, 
                                [updatedOneBooking.author, updatedOneBooking.bookingId])
        }
        if(updatedOneBooking.payment) {
            await client.query(`update roadey.bookings set "payment" = $1 
                                where "booking_id" = $2;`, 
                                [updatedOneBooking.payment, updatedOneBooking.bookingId])
        }
        if(updatedOneBooking.payment) {
            await client.query(`update roadey.bookings set "venue" = $1 
                                where "booking_id" = $2;`, 
                                [updatedOneBooking.venue, updatedOneBooking.bookingId])
        }
        if(updatedOneBooking.gigDate) {
            await client.query(`update roadey.bookings set "date_submitted" = $1 
                                where "booking_id" = $2;`, 
                                [updatedOneBooking.gigDate, updatedOneBooking.bookingId])
        }
        if(updatedOneBooking.dateSubmitted) {
            await client.query(`update roadey.bookings set "date_submitted" = $1 
                                where "booking_id" = $2;`, 
                                [updatedOneBooking.dateSubmitted, updatedOneBooking.bookingId])
        }
        if(updatedOneBooking.dateResolved) {
            await client.query(`update roadey.bookings set "date_resolved" = $1 
                                where "booking_id" = $2;`, 
                                [updatedOneBooking.dateResolved, updatedOneBooking.bookingId])
        }
        if(updatedOneBooking.description) {
            await client.query(`update roadey.bookings set "description" = $1 
                                where "booking_id" = $2;`, 
                                [updatedOneBooking.description, updatedOneBooking.bookingId])
        }
        if(updatedOneBooking.status) {
            let statusId = await client.query(`select bs."status_id" from roadey.booking_statuses bs 
                                            where bs."status" = $1;`, [updatedOneBooking.status])
            if(statusId.rowCount === 0) {
                throw new Error('Status Not Found')
            }
            statusId = statusId.rows[0].status_id
            await client.query(`update roadey.bookings set "status" = $1 
                                where "booking_id" = $2;`, 
                                [statusId, updatedOneBooking.bookingId])
        }
        if(updatedOneBooking.type) {
            let typeId = await client.query(`select bt."type_id" from roadey.booking_types bt 
                                            where bt."type" = $1;`, [updatedOneBooking.type])
            if(typeId.rowCount === 0) {
                throw new Error('Type Not Found')
            }
            typeId = typeId.rows[0].type_id
            await client.query(`update roadey.bookings set "type" = $1 
                                where "booking_id" = $2;`, 
                                [typeId, updatedOneBooking.bookingId])
        }

        await client.query('COMMIT;')
        return updatedOneBooking
    } catch(e) {
        client && client.query('ROLLBACK;')
        if(e.message == 'Status Not Found' || e.message == 'Type Not Found') {
            throw new BookingInputError()
        }
        console.log(e);
        throw new Error('Unknown Error Occured')
    } finally {
        client && client.release()
    }
}
