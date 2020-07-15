// Booking data from DB

export class BookingDTO {
  booking_id: number
    author: number
    venue: string
    payment: number
    gig_date: Date
    date_submitted: Date
    date_resolved: Date
    description: string
    status: string
    status_id: number
    type: string
    type_id: number
}
