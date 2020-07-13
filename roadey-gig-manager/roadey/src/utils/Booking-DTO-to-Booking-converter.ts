import { BookingDTO } from "../dtos/booking-dto";
import { Booking } from "../models/booking";

// BookingDTO takes objects in DB format & converts it to Reimbursement model object(s)
export function BookingDTOtoBookingConverter(bdto: BookingDTO): Booking {
    return {
        bookingId: bdto.booking_id,
        venue: bdto.venue,
        payment: bdto.payment,
        gigDate: new Date(bdto.gig_date),
        dateSubmitted: new Date(bdto.date_submitted), //rdto.date_submitted.getFullYear(),
        dateResolved: new Date(bdto.date_resolved),//rdto.date_resolved.getFullYear(),
        description: bdto.description,
        status: {
            status: bdto.status,
            statusId: bdto.status_id
        },
        type: {
            type: bdto.type,
            typeId: bdto.type_id
        }
    }
}
