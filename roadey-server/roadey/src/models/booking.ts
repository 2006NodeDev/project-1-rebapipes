import { BookingStatus } from "./booking-status"
import { BookingType } from "./booking-type"

export class Booking {
    bookingId: number //primary key
    author: number //foreign key -> user not null
    venue: string //not null
    payment: number //not null
    gigDate: Date //not null
    dateSubmitted: Date //not null
    dateResolved: Date //allowed this to be null for Pending bookings
    description: string //not null
    status: BookingStatus //foreign key -> BookingStatus, not null
    type: BookingType //foreign key -> BookingType
}
